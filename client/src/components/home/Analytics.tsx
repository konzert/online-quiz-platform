import React, { useState, useEffect } from 'react';
import { Nav, Site, Container, Table, Button, Card } from 'tabler-react';
import { auth, firestore } from '../utils/Firebase';
import axios from 'axios';

const Analytics = () => {

    const [name, setName] = useState('');
    const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);

    const Navbar = () => {
        const loadName = async (uid: any) => {
            try {
                const doc: any = await firestore.collection('users').doc(uid).get();

                if (doc.exists) {
                    setName(doc.data().name);
                }
            } catch (err) {
                console.log('Error getting document:', err);
            }
        };

        auth.onAuthStateChanged(async function (user: any) {
            if (user) {
                var user: any = auth.currentUser;
                if (user != null) {
                    var io = user.uid;
                    // window.alert('success ' + io);
                    if (name === '') {
                        loadName(io);
                    }
                }
            } else {
                // No user is signed in.
                console.log('no user found');
            }
        });

        const accountDropdownProps = {
            // avatarURL: './demo/faces/female/25.jpg',
            name,
            description: 'Teacher',
            options: [{ icon: 'log-out', value: 'Sign out', to: 'signout' }],
        };

        const items = (
            <Nav>
                <Nav.Item active value="Manage Engaugements" icon="globe" />

                <Nav.Item icon="plus" to="/create">
                    Add Engaugement
                </Nav.Item>
            </Nav>
        );

        return (
            <div className="navbar-menu">
                <Site.Header imageURL={'https://i.imgur.com/u6424qJ.png'} href="/" accountDropdown={accountDropdownProps} align="left" />

                <Site.Nav items={items} />
            </div>
        );
    };

    //gets the number from the url
    var questionsParsed: any = [];
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        getAllAnswers(urlParams.get('number')).then(async (qna) => {
            setQuestionsAndAnswers(qna);
        });

    }, []);

    async function getAllAnswers(eventKey: any) {
        return axios({
            url: 'http://localhost:3000/api/answers/room/' + eventKey,
            method: 'get',
        })
            .then((response: any) => {
                return response.data;
            })
            .catch((err: any) => {
                console.log('unsuccessful in getting answers: ', err);
            });
    }

    return (
        <>
            <Navbar />
            <br />
            <br />
            <Container>
            {questionsAndAnswers.map((qna, index) =>{
                return (
                    <Card>
                    <Card.Header>
                        <Card.Title>Question {(index + 1)}: {qna['questionLabel']}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        Collected answers: <br />
                        {qna['answers']}
                    </Card.Body>
                    <Card.Footer>
                        Possible choices: <br />
                        {qna['choices']}
                    </Card.Footer>
                </Card>
                );
            })}
                
            </Container>
        </>
    );
};

export default Analytics;
