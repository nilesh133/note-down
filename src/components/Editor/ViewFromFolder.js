import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db, firebase, auth } from "../../firebase";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import RawTool from "@editorjs/raw";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import CodeTool from "@editorjs/code";
import "./view.css";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../Loader/Loader";
import Navbar from "../Navbar/Navbar";
import Title from "../Title/Title";

import SimpleImage from "./simple-image";
import "./simple-image.css";
import FileImage from "./file-image";
import "./file-image.css";
import LinkData from "./link";
import "./link.css"

import RawHtml from "./raw-html";
import "./raw-html.css"

import { HiOutlineHome, HiOutlineLogout } from "react-icons/hi";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    // sendEmailVerification
} from "firebase/auth";

const ViewFromFolder = () => {
    const { folderid, pageid } = useParams();
    const history = useHistory();
    const [notes, setNotes] = useState(null);
    const [time, setTime] = useState(null);
    const [blocks, setBlocks] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileNameRef = useRef();

    const [loader, setLoader] = useState(false);
    const [user, loading] = useAuthState(auth);

    const [htmlCode, setHtmlCode] = useState("");

    useEffect(() => {
        setLoader(true);
        if (!loading) {
            if (user) {
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
                        if (doc.data().notes != undefined) {
                            for (let block of doc?.data()?.notes?.blocks) {
                                if (block.type === "table") {
                                    let data = JSON.parse(block.data.content);
                                    block.data.content = data;
                                }
                            }

                            setBlocks(
                                doc?.data()?.notes?.blocks?.map((block) => {

                                    if (block.type === "table") {
                                        block.data.content = JSON.parse(block.data.content);
                                    }
                                    if (block.type === "fileimg") {
                                        let data = block.data;
                                        block.data = {
                                            ...data,
                                            file: { url: data.url, width: 600, height: 338 },
                                        };
                                        block.type = "image"
                                    }
                                    return block;
                                })
                            );

                        }

                        setTime(doc?.data()?.notes?.time);
                        setFileName(doc?.data()?.fileName);
                        fileNameRef.current = doc.data()?.fileName;

                        setNotes(doc.data());
                        setLoader(false);
                    });
            }
        }
    }, [user, loading, folderid, pageid]);

    const saveData = async () => {
        await editor
            .save()
            .then((outputData) => {
                for (const key in outputData) {
                    if (key === "blocks") {
                        for (let block of outputData[key]) {
                            if (block.type === "table") {
                                let stringTable = JSON.stringify(block.data.content);
                                block.data.content = stringTable;
                            }
                        }
                    }
                }
                db.collection("UserData")
                    .doc("Users")
                    .collection("User")
                    .doc(user?.uid)
                    .collection("userFolder")
                    .doc(folderid)
                    .collection('folderFiles')
                    .doc(pageid)
                    .set(
                        {
                            notes: outputData,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        },
                        { merge: true }
                    );
            })
            .catch((error) => {
                console.log("Saving failed: ", error);
            });
    };

    async function LogoutUser() {
        await signOut(auth);
        history.push("/")
    }

    const editor = new EditorJS({
        holder: "editorjs",
        onChange: () => saveData(),
        tools: {
            header: {
                class: Header,
                shortcut: "CMD+SHIFT+H",
                config: {
                    placeholder: "Enter a header",
                    levels: [1, 2, 3, 4],
                    defaultLevel: 3,
                },
            },
            checklist: {
                class: Checklist,
                inlineToolbar: true,
            },
            raw: RawTool,
            link: {
                class: LinkData
            },
            list: {
                class: List,
                inlineToolbar: true,
                config: {
                    defaultStyle: "unordered",
                },
            },
            embed: {
                class: Embed,
                config: {
                    services: {
                        youtube: true,
                        coub: true,
                    },
                },
            },
            image: {
                class: SimpleImage,
                inlineToolbar: true,
            },
            fileimg: {
                class: FileImage,
            },
            quote: Quote,
            table: {
                class: Table,
                inlineToolbar: true,
                config: {
                    rows: 2,
                    cols: 3,
                },
            },
            delimiter: Delimiter,
            inlineCode: {
                class: InlineCode,
            },
            code: CodeTool,
            rawhtml: {
                class: RawHtml,
            },
        },
        data: {
            // notes
            time: time,
            blocks: blocks,
        },

        placeholder: 'Enter your content here...'
    });

    return (
        <div className="main_editor">
            <Navbar />

            {loading ? (
                <Loader />
            ) : (
                <div className="main_editor_container">
                    <div className="editor_foldermodal">
                        <div></div>
                        <div className="editor_foldermodal_right">
                            <span title="Home" onClick={() => history.push("/")}><HiOutlineHome /></span>
                            <span title="Logout" onClick={LogoutUser}><HiOutlineLogout /></span>
                            <div className="userinfo">
                                <img src={user.photoURL} />
                                <div className="userinfo_details">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="editor_heading">
                        <Title type="folder" />
                    </div>

                    <div className="main_container">
                        <div className="container">
                            <div id="editorjs" className="editor_container"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewFromFolder;