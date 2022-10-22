import React from 'react'
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "./folder.css"
import { FcFolder } from "react-icons/fc";
import { useState, useEffect } from 'react';
import { MdEdit, MdEditOff } from "react-icons/md"
import { AiFillCaretRight, AiFillCaretDown } from "react-icons/ai"
import { BsPlusCircleFill } from "react-icons/bs"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { Link, useParams } from 'react-router-dom';
import { TbFiles } from 'react-icons/tb';

const Folder = ({ id, folderName }) => {
    const [user, loading] = useAuthState(auth);
    const [folderNameEdit, setFolderNameEdit] = useState(folderName);
    const [enableEdit, setEnableEdit] = useState(true);
    const [showFolderFiles, setShowFolderFiles] = useState(false);
    const [folderPages, setFolderPages] = useState([]);
    const { pageid } = useParams();

    const fileIconColors = ["#ffa500", "#00ff00", "#008080", "#ff00ff"]

    useEffect(() => {
        if (user?.uid) {
            db.collection("UserData")
                .doc("Users")
                .collection("User")
                .doc(user?.uid)
                .collection("userFolder")
                .doc(id)
                .collection("folderFiles")
                .onSnapshot((querySnapshot) => {
                    setFolderPages([]);
                    querySnapshot.forEach((doc) => {
                        setFolderPages((prear) => [...prear, doc]);
                    });
                });
        }
    }, [user]);

    const createFileUnderPresentFolder = () => {
        db.collection("UserData")
            .doc("Users")
            .collection("User")
            .doc(user?.uid)
            .collection("userFolder")
            .doc(id)
            .collection("folderFiles")
            .add({
                fileName: "Untitled",
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
    }

    const changeFolderName = (e) => {
        setFolderNameEdit(e.target.value);
        db.collection("UserData")
            .doc("Users")
            .collection("User")
            .doc(user?.uid)
            .collection("userFolder")
            .doc(id).set(
                {
                    folderName: e.target.value
                },
                { merge: true }
            )
    };

    return (
        <div className="folderList">
            <div className="folderListOuter">
                <div className="folderListLeft">
                    <span className="folderListLeftIcon"><FcFolder /></span>
                    <input
                        disabled={enableEdit}
                        autoFocus={enableEdit}
                        className="folderInput"
                        value={folderNameEdit}
                        onChange={changeFolderName}
                    />
                </div>
                <div className="folderListRight">
                    <span onClick={() => setEnableEdit(!enableEdit)}>
                        {
                            enableEdit ? <MdEdit /> : <MdEditOff />
                        }
                    </span>
                    {
                        showFolderFiles ? (
                            <span><AiFillCaretDown onClick={() => setShowFolderFiles(!showFolderFiles)} /></span>
                        ) :
                            (
                                <span><AiFillCaretRight onClick={() => setShowFolderFiles(!showFolderFiles)} /></span>
                            )
                    }
                </div>
            </div>
            <div className={showFolderFiles ? "folderListInner" : "folderListInner_hide"}>
                <div className="folderListInner_pages">
                    {
                        folderPages.map((page, i) => (
                            <div className={page.id === pageid ? "navbar_files_file_active" : "navbar_files_file_notactive"}>
                                <span style={{ color: `${fileIconColors[i % fileIconColors.length]}` }}><TbFiles /></span>
                                <Link to={`/folder/${id}/${page.id}`}>{page.data().fileName}</Link>
                            </div>
                        ))
                    }
                    <div className="folderListInner_newpage" onClick={createFileUnderPresentFolder}>
                        <p>New Page</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Folder