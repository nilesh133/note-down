import React from 'react'
import { useState } from 'react';
import "./title.css"
import { useParams } from "react-router-dom";
import { db, firebase, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';
import Loader from '../Loader/Loader';
const Title = ({ type }) => {
    const { id } = useParams();
    const { folderid, pageid } = useParams();
    const [singlePageTitle, setSinglePageTitle] = useState('');
    const [folderName, setFolderName] = useState('');
    const [folderPageTitle, setFolderPageTitle] = useState('');
    const [user, loading] = useAuthState(auth);


    useEffect(() => {
        if (!loading) {
            if (user) {
                db.collection("UserData")
                    .doc("Users")
                    .collection("User")
                    .doc(user?.uid)
                    .collection("userEditor")
                    .doc(id)
                    .get()
                    .then((doc) => {
                        setSinglePageTitle(doc?.data()?.fileName)
                    })
            }
        }

    }, [user, id, pageid, folderid])


    const saveSinglePageTitle = (e) => {
        setSinglePageTitle(e.target.value);
        db.collection("UserData")
            .doc("Users")
            .collection("User")
            .doc(user?.uid)
            .collection("userEditor")
            .doc(id).set(
                {
                    fileName: e.target.value
                },
                { merge: true }
            )
    };

    useEffect(() => {
        if (!loading) {
            if (user) {
                db.collection("UserData")
                    .doc("Users")
                    .collection("User")
                    .doc(user?.uid)
                    .collection("userFolder")
                    .doc(folderid)
                    .get()
                    .then((doc) => {
                        setFolderName(doc?.data()?.folderName)
                    })

                db.collection("UserData")
                    .doc("Users")
                    .collection("User")
                    .doc(user?.uid)
                    .collection("userFolder")
                    .doc(folderid)
                    .collection("folderFiles")
                    .doc(pageid)
                    .get()
                    .then((doc) => {
                        setFolderPageTitle(doc?.data()?.fileName)
                    })
            }
        }

    }, [user, id, pageid, folderid])

    const saveFolderPageTitle = (e) => {
        setFolderPageTitle(e.target.value);
        db.collection("UserData")
            .doc("Users")
            .collection("User")
            .doc(user?.uid)
            .collection("userFolder")
            .doc(folderid)
            .collection("folderFiles")
            .doc(pageid).set(
                {
                    fileName: e.target.value
                },
                { merge: true }
            )
    };


    return (
        type === "page" ? <div>
            <div className="title_container">
                <input type="text"
                    className="inputstyle"
                    value={singlePageTitle === "Untitled" ? "" : singlePageTitle}
                    onChange={saveSinglePageTitle}
                    placeholder="Enter Your Title"
                />
            </div>
        </div> :
        
            <div>
                <div className="title_container">
                    <input type="text"
                        className="inputstyle"
                        value={folderPageTitle === "Untitled" ? "" : folderPageTitle}
                        onChange={saveFolderPageTitle}
                        placeholder="Enter Your Title"
                    />
                </div>
            </div>

    )
}

export default Title