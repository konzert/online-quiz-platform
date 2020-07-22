import React, { useState, useEffect } from 'react';
import { Nav, Site, Container, Table, Button } from 'tabler-react';
import { auth, firestore } from '../utils/Firebase';
import { Card } from 'reactstrap';
import axios from 'axios';

// const logo = require('../assets/leasemagnets-logo.png');

const Navbar = () => {
    // var user = auth.currentUser;
    // useEffect(() => {
    //     if (auth.currentUser.uid) {
    //         loadName(auth.currentUser.uid);
    //     }
    // }, [auth.currentUser.uid]);

    const [name, setName] = useState('');

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

    function getRooms(choiceNum: any) {
        return axios({
            url: 'http://localhost:3000/api/rooms/presenter/',
            method: 'get',
        }).then((response: any) => {
            console.log(response);
            // return response.data;
        });
    }

    auth.onAuthStateChanged(function (user: any) {
        if (user) {
            var user: any = auth.currentUser;

            if (user != null) {
                var io = user.uid;
                // window.alert('success ' + io);
                loadName(io);
            }
        } else {
            // No user is signed in.
            console.log('no user found');
        }
    });

    const accountDropdownProps = {
        // avatarURL: './demo/faces/female/25.jpg',
        name,
        description: 'Administrator',
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

const ManageQuizzes = () => {
    return (
        <>
            <Navbar />
            <Container>
                <Card>
                    <Table>
                        <Table.Header>
                            <Table.ColHeader>ID</Table.ColHeader>
                            <Table.ColHeader>Room Name</Table.ColHeader>
                            <Table.ColHeader>Action</Table.ColHeader>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Col>1</Table.Col>
                                <Table.Col>Amulya Parmar</Table.Col>
                                <Table.Col>
                                    <Button color="primary">Edit</Button>
                                </Table.Col>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Card>
            </Container>
        </>
    );
};

export default ManageQuizzes;
