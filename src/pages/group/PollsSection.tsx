import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, ListGroup, Badge, Card, ProgressBar, Tooltip, OverlayTrigger } from 'react-bootstrap';

type Poll = {
    pollId: string;
    question: string;
    options: { optionId: string, optionText: string, voteCount: number }[];
    anonymous: boolean;
};

type PollDTO = {
    question: string;
    options: string[];
    anonymous: boolean;
};

const PollsSection = ({ tripGroupId, userId }: { tripGroupId: string, userId: string }) => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [newPoll, setNewPoll] = useState<PollDTO>({ question: '', options: [], anonymous: false });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userVotes, setUserVotes] = useState<{ [pollId: string]: string | null }>({});

    useEffect(() => {
        fetchPolls();
    }, [tripGroupId]);

    const fetchPolls = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/trip-groups/${tripGroupId}/polls`);
            setPolls(response.data);
            const userVotesResponse = await axios.get(`http://localhost:8080/api/v1/user-vote/${userId}/votes`);
            const votesMap = userVotesResponse.data.reduce((acc: any, vote: any) => {
                acc[vote.pollId] = vote.optionId;
                return acc;
            }, {});
            setUserVotes(votesMap);
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    };

    const createPoll = async () => {
        if (!newPoll.question || newPoll.options.length < 2) {
            alert('Please provide a question and at least two options.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`http://localhost:8080/api/v1/trip-groups/${tripGroupId}/polls/create`, newPoll);
            setShowModal(false);
            fetchPolls(); // Refresh polls after creating
        } catch (error) {
            console.error('Error creating poll:', error);
        } finally {
            setLoading(false);
        }
    };

    const voteOption = async (pollId: string, optionId: string) => {
        try {
            await axios.post(
                `http://localhost:8080/api/v1/trip-groups/${tripGroupId}/polls/${pollId}/vote/${optionId}?userId=${userId}`
            );
            setUserVotes({ ...userVotes, [pollId]: optionId });
            fetchPolls();
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const deletePoll = async (pollId: string) => {
        if (window.confirm('Are you sure you want to delete this poll?')) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/trip-groups/${tripGroupId}/polls/${pollId}`);
                fetchPolls(); // Refresh polls after deletion
            } catch (error) {
                console.error('Error deleting poll:', error);
            }
        }
    };

    const handlePollOptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
            <h3 className="my-4">Polls for this Trip Group</h3>
            <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>Create New Poll</Button>

            <div className="mt-4">
                {polls.length === 0 ? (
                    <p>No polls available for this trip group.</p>
                ) : (
                    polls.map((poll) => (
                        <Card className="mb-3" key={poll.pollId}>
                            <Card.Header as="h5">{poll.question}</Card.Header>
                            <Card.Body>
                                {poll.options.map((option) => {
                                    const totalVotes = poll.options.reduce((total, option) => total + option.voteCount, 0);
                                    const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                                    return (
                                        <div key={option.optionId} className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="d-flex align-items-center">
                                                <span>{option.optionText}</span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id={`tooltip-${option.optionId}`}>{option.voteCount} votes</Tooltip>}
                                                >
                                                    <Badge pill className="ms-2 bg-secondary">{option.voteCount}</Badge>
                                                </OverlayTrigger>
                                            </div>
                                            <div className="w-50">
                                                <ProgressBar now={percentage} label={`${percentage.toFixed(1)}%`} />
                                            </div>
                                            <Button
                                                variant={userVotes[poll.pollId] === option.optionId ? "info" : "success"}
                                                size="sm"
                                                onClick={() => voteOption(poll.pollId, option.optionId)}
                                                disabled={userVotes[poll.pollId] && userVotes[poll.pollId] !== option.optionId}
                                            >
                                                {userVotes[poll.pollId] === option.optionId
                                                    ? 'Your Vote'
                                                    : `Vote`}
                                            </Button>
                                        </div>
                                    );
                                })}
                                <div className="mt-2">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => deletePoll(poll.pollId)}
                                    >
                                        Delete Poll
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
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
