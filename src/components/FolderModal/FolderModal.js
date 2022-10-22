import React, { useState, useEffect, useRef } from 'react'
import "./foldermodal.css"
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useHistory } from 'react-router-dom';
import { Modal, useModal, Button, Text, Input } from "@nextui-org/react";
import { FcFolder } from "react-icons/fc";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {RiArrowDownSFill} from "react-icons/ri"
import {BiFolder} from "react-icons/bi"

const FolderModal = () => {
    const history = useHistory();
    const { setVisible, bindings } = useModal();
    const isMounted = useRef();

    const { id } = useParams();
    const [user, loading] = useAuthState(auth);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [folders, setFolders] = useState([])
    const [filteredFolders, setFilteredFolders] = useState([]);
    const [presentPage, setPresentPage] = useState([]);
    const [searchedValue, setSearchedValue] = useState('');

    const fetchFolders = () => {
        if (user?.uid) {
            db.collection("UserData")
                .doc("Users")
                .collection("User")
                .doc(user?.uid)
                .collection("userFolder")
                .orderBy('timestamp', 'asc')
                .onSnapshot((querySnapshot) => {
                    setFolders([]);
                    setFilteredFolders([]);
                    querySnapshot.forEach((doc) => {
                        setFilteredFolders((prear) => [...prear, doc])
                        setFolders((prear) => [...prear, doc]);
                    });
                });
        }
    }
    useEffect(() => {
        if (isMounted.current) return;
        fetchFolders();
        isMounted.current = true;
    }, [user]);

    const movePageToFolder = async (folderid) => {
        await db.collection("UserData")
            .doc("Users")
            .collection("User")
            .doc(user?.uid)
            .collection("userEditor")
            .doc(id)
            .get()
            .then(async (doc) => {
                await db.collection("UserData")
                    .doc("Users")
                    .collection("User")
                    .doc(user?.uid)
                    .collection("userFolder")
                    .doc(folderid)
                    .collection("folderFiles")
                    .add({
                        emoji: doc.data().emoji || "",
                        fileName: doc.data().fileName || "",
                        notes: doc.data().notes || ""
                    })
            })

        await db.collection("UserData")
            .doc("Users")
            .collection("User")
            .doc(user?.uid)
            .collection("userEditor")
            .doc(id)
            .delete({})

        history.push(`/folder/${folderid}/${id}`)
    }

    const filterFolders = (e) => {
        const inpuVal = e.target.value;
        setSearchedValue(inpuVal);

        if (inpuVal !== '') {
            const results = folders.filter((folder) => {
                return folder.data().folderName.toLowerCase().includes(inpuVal.toLowerCase());
            });
            setFilteredFolders(results);
        } else {
            setFilteredFolders(folders);
        }
    }

    const createNewFolderFromModal = () => {
        db.collection("UserData")
            .doc("Users")
            .collection("User")
            .doc(user?.uid)
            .collection("userFolder")
            .add({
                folderName: "Untitled",
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })

        fetchFolders();
    }

    const nextmodal = <div>
        <div className="openfolder_container" onClick={() => setVisible(true)}>
            <span><BiFolder/></span>
            <p>All folders</p>
            <span style={{fontSize: "1.4rem"}}><RiArrowDownSFill/></span>
        </div>
        
        <Modal
            scroll
            width="300px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            {...bindings}
            css={{background: "#010409", boxShadow: "none"}}
        >
            <Modal.Header>
                <Text id="modal-title" size={18} css = {{ color: "#1e90ff", fontFamily: "Poppins"}}>
                    All Folders
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Input placeholder="Search Folder" onChange={filterFolders} value={searchedValue} />
                {
                    filteredFolders.map((filteredFolder) => (
                        <Button color="warning" auto flat
                        css={{background: "#0d1117", boxShadow: "none", color: "#fff"}}
                            onPress={() => {
                                movePageToFolder(filteredFolder.id)
                                setVisible(false)
                            }}>
                            <FcFolder />
                            {filteredFolder.data().folderName}
                        </Button>
                    ))
                }
            </Modal.Body>
            <Modal.Body>
                <Button onPress={() => createNewFolderFromModal()} auto flat css={{background: "transparent", border: "2px solid #fff", color: "#fff"}}>
                    Create New Folder
                </Button>

            </Modal.Body>
            <Modal.Footer>
                <Button auto flat onPress={() => setVisible(false)} css = {{background: "#1e90ff", color: "#fff"}}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </div>

    return (
        <div className="folder_modal_container">
            <div className="folder_modal">
                <div className="nextmodal">
                    {nextmodal}
                </div>
            </div>
        </div>
    )
}

export default FolderModal