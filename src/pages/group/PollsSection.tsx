import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Dummy Data for Polls
const dummyPolls = [
    {
        id: "1",
        question: "What's your favorite programming language?",
        options: ["JavaScript", "Python", "Java", "C++"],
        votes: [10, 15, 5, 8],
    },
    {
        id: "2",
        question: "Best vacation destination?",
        options: ["Hawaii", "Paris", "Bali", "Dubai"],
        votes: [7, 12, 18, 6],
    },
];

const VOTE_STORAGE_KEY = "userPollVotes";

// Get and save votes to localStorage
const getUserVotes = (): Record<string, number> => {
    const data = localStorage.getItem(VOTE_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

const saveUserVote = (pollId: string, optionIndex: number) => {
    const votes = getUserVotes();
    votes[pollId] = optionIndex;
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
};

type Poll = {
    id: string;
    question: string;
    options: string[];
    votes: number[];
};

const PollsSection: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [userVotes, setUserVotes] = useState<Record<string, number>>({});

    useEffect(() => {
        setPolls(dummyPolls);
        setUserVotes(getUserVotes());
    }, []);

    const handleVoteChange = (pollId: string, optionIndex: number) => {
        // Check if user already voted in this poll
        const previousVote = userVotes[pollId];

        // Update poll with new vote count
        setPolls((prevPolls) =>
            prevPolls.map((poll) =>
                poll.id === pollId
                    ? {
                        ...poll,
                        votes: poll.votes.map((v, i) =>
                            i === optionIndex
                                ? v + 1
                                : i === previousVote
                                    ? v - 1
                                    : v
                        ),
                    }
                    : poll
            )
        );

        // Update localStorage and user votes state
        const updatedVotes = { ...userVotes, [pollId]: optionIndex };
        setUserVotes(updatedVotes);
        saveUserVote(pollId, optionIndex);
        toast.success("Your vote has been updated!");
    };

    return (
        <div className="container py-4">
           

            {/* Polls Grid */}
            <div className="row">
                {polls.map((poll) => (
                    <div className="col-md-6 col-lg-4 mb-4" key={poll.id}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{poll.question}</h5>
                                <ul className="list-group list-group-flush mt-3">
                                    {poll.options.map((opt, idx) => {
                                        const voteCount = poll.votes[idx];
                                        const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
                                        const percentage = ((voteCount / totalVotes) * 100).toFixed(2);

                                        const votedOption = userVotes[poll.id];

                                        return (
                                            <li
                                                className={`list-group-item ${votedOption === idx ? "bg-light border-primary" : ""
                                                    }`}
                                                key={idx}
                                                style={{
                                                    cursor: votedOption === undefined || votedOption === idx ? "pointer" : "not-allowed",
                                                    opacity: votedOption !== undefined && votedOption !== idx ? 0.6 : 1,
                                                }}
                                                onClick={() =>
                                                    votedOption === undefined || votedOption !== idx
                                                        ? handleVoteChange(poll.id, idx)
                                                        : null
                                                }
                                            >
                                                <div className="d-flex justify-content-between">
                                                    <span>
                                                        {opt}{" "}
                                                        {votedOption === idx && (
                                                            <span className="badge bg-primary ms-1">Your Vote</span>
                                                        )}
                                                    </span>
                                                    <span className="text-muted small">
                                                        {voteCount} vote{voteCount !== 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                                <div className="progress mt-1" style={{ height: "8px" }}>
                                                    <div
                                                        className="progress-bar bg-info"
                                                        role="progressbar"
                                                        style={{ width: `${percentage}%` }}
                                                        aria-valuenow={parseFloat(percentage)}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    ></div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollsSection;
