import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal, Card, ProgressBar, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { createNewPoll, deletePollById, fetchPollsByTripGroup, fetchUserVotes, voteOnPollOption } from '../../api/api';

type PollOption = {
    optionId: string;
    optionText: string;
    voteCount: number;
};

type Poll = {
    pollId: string;
    question: string;
    options: PollOption[];
    anonymous: boolean;
};

type PollDTO = {
    question: string;
    options: string[];
    anonymous: boolean;
};

type PollUpdateMessage = {
    pollId: string;
    options: PollOption[];
};

const PollsSection = ({ tripGroupId, userId }: { tripGroupId: string; userId: string }) => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [newPoll, setNewPoll] = useState<PollDTO>({ question: '', options: ['', ''], anonymous: false });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userVotes, setUserVotes] = useState<{ [pollId: string]: string | null }>({});
    const stompClient = useRef<any>(null);

    useEffect(() => {
        fetchPolls();
        connectWebSocket();

        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect();
            }
        };
    }, [tripGroupId]);

    const fetchPolls = async () => {
        try {
            const response = await fetchPollsByTripGroup(tripGroupId);
            setPolls(response.data);

            const userVotesResponse = await fetchUserVotes(userId);
            const votesMap = userVotesResponse.data.reduce((acc: any, vote: any) => {
                acc[vote.pollId] = vote.optionId;
                return acc;
            }, {});
            setUserVotes(votesMap);
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    };

    const connectWebSocket = () => {
        const socket = new SockJS('https://flight-search-and-reservation-app.onrender.com/ws'); // Adjust path if needed
        stompClient.current = Stomp.over(socket);
        // Optional: Enable debug logs for STOMP:
        // stompClient.current.debug = (msg: string) => { console.log(msg); };

        stompClient.current.connect({}, () => {
            console.log('WebSocket connected');
            stompClient.current.subscribe(`/topic/poll-updates/${tripGroupId}`, (message: any) => {
                if (message.body) {
                    const update: PollUpdateMessage = JSON.parse(message.body);
                    setPolls((prevPolls) => {
                        return prevPolls.map((poll) => {
                            if (poll.pollId === update.pollId) {
                                return { ...poll, options: update.options };
                            }
                            return poll;
                        });
                    });
                }
            });
        });
    };

    const createPoll = async () => {
        if (!newPoll.question.trim() || newPoll.options.length < 2 || newPoll.options.some((opt) => opt.trim() === '')) {
            alert('Please provide a question and at least two non-empty options.');
            return;
        }

        setLoading(true);
        try {
            await createNewPoll(tripGroupId, newPoll);
            setShowModal(false);
            setNewPoll({ question: '', options: ['', ''], anonymous: false });
            fetchPolls();
        } catch (error) {
            console.error('Error creating poll:', error);
        } finally {
            setLoading(false);
        }
    };


    const voteOption = async (pollId: string, optionId: string) => {
        try {
            setUserVotes((prev) => ({ ...prev, [pollId]: optionId }));
            await voteOnPollOption(tripGroupId, pollId, optionId, userId);
        } catch (error) {
            console.error('Error voting:', error);
            setUserVotes((prev) => ({ ...prev, [pollId]: null }));
        }
    };


    const deletePoll = async (pollId: string) => {
        if (window.confirm('Are you sure you want to delete this poll?')) {
            try {
                await deletePollById(tripGroupId, pollId);
                setPolls((prev) => prev.filter((poll) => poll.pollId !== pollId));
                setUserVotes((prev) => {
                    const copy = { ...prev };
                    delete copy[pollId];
                    return copy;
                });
            } catch (error) {
                console.error('Error deleting poll:', error);
            }
        }
    };


    const handlePollOptionChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        index: number
    ) => {
        const { value } = e.target;
        setNewPoll((prevPoll) => {
            const updatedOptions = [...prevPoll.options];
            updatedOptions[index] = value;
            return { ...prevPoll, options: updatedOptions };
        });
    };

    const addPollOption = () => {
        setNewPoll((prevPoll) => ({
            ...prevPoll,
            options: [...prevPoll.options, ''],
        }));
    };

    return (
        <div className="container">
            <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
                Create New Poll
            </Button>

            <div className="mt-4">
                {polls.length === 0 ? (
                    <p>No polls available for this trip group.</p>
                ) : (
                    polls.map((poll) => {
                        // const totalVotes = poll.options.reduce((total, o) => total + o.voteCount, 0);
                        // const userVotedOption = userVotes[poll.pollId];

                        return (
                            <Card className="mb-3" key={poll.pollId}>
                                <Card.Header as="h5">{poll.question}</Card.Header>
                                <Card.Body>
                                    {poll.options.map((option) => {
                                        const totalVotes = poll.options.reduce((total, o) => total + o.voteCount, 0);
                                        const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                                        const userVotedOption = userVotes[poll.pollId];

                                        const isSelected = userVotedOption === option.optionId;

                                        return (
                                            <div key={option.optionId} className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center">
                                                    <span>{option.optionText}</span>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip id={`tooltip-${option.optionId}`}>{option.voteCount} votes</Tooltip>}
                                                    >
                                                        <Badge pill className="ms-2 bg-secondary">
                                                            {option.voteCount}
                                                        </Badge>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="w-50">
                                                    <ProgressBar now={percentage} label={`${percentage.toFixed(1)}%`} />
                                                </div>
                                                <Button
                                                    variant={isSelected ? 'info' : 'outline-success'}
                                                    size="sm"
                                                    onClick={() => voteOption(poll.pollId, option.optionId)}
                                                >
                                                    {isSelected ? 'Change Vote' : 'Vote'}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                    <div className="mt-2">
                                        <Button variant="danger" size="sm" onClick={() => deletePoll(poll.pollId)}>
                                            Delete Poll
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        );
                    })
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create a Poll</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="pollQuestion">
                            <Form.Label>Poll Question</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your question"
                                value={newPoll.question}
                                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Label>Poll Options</Form.Label>
                        {newPoll.options.map((option, index) => (
                            <Form.Group key={index}>
                                <Form.Control
                                    type="text"
                                    value={option}
                                    onChange={(e) => handlePollOptionChange(e, index)}
                                    placeholder={`Option ${index + 1}`}
                                />
                            </Form.Group>
                        ))}
                        <Button variant="link" onClick={addPollOption}>
                            Add Option
                        </Button>

                        <Form.Group controlId="anonymous">
                            <Form.Check
                                type="checkbox"
                                label="Anonymous Poll"
                                checked={newPoll.anonymous}
                                onChange={(e) => setNewPoll({ ...newPoll, anonymous: e.target.checked })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createPoll} disabled={loading}>
                        {loading ? 'Creating Poll...' : 'Create Poll'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PollsSection;
