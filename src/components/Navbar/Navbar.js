import React, { useEffect, useState } from "react";
import "./navbar.css";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionOnce } from "react-firebase-hooks/firestore";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useHistory, useParams, Link, NavLink } from "react-router-dom";

import Folder from "../Folder/Folder";

import {TbFiles} from "react-icons/tb"
import {HiPlusSm} from "react-icons/hi"

const Navbar = () => {
  const history = useHistory();
  var doc_id;
  const { id } = useParams();
  const [user, loading] = useAuthState(auth);
  const [loader, setLoader] = useState(false);
  const [input, setInput] = useState("");

  let [createdFiles, setCreatedFiles] = useState([]);
  let [createdFolders, setCreatedFolders] = useState([]);

  useEffect(() => {
    setLoader(true);
    if (user?.uid) {
      db.collection("UserData")
        .doc("Users")
        .collection("User")
        .doc(user?.uid)
        .collection("userEditor")
        .orderBy('timestamp', 'asc')
        .onSnapshot((querySnapshot) => {
          setCreatedFiles([]);
          querySnapshot.forEach((doc) => {
            setCreatedFiles((prear) => [...prear, doc.data()]);
          });
        });
    }
    setLoader(false);
  }, [user]);


  const fetchFolders = () => {
    db.collection("UserData")
      .doc("Users")
      .collection("User")
      .doc(user?.uid)
      .collection("userFolder")
      .orderBy('timestamp', 'asc')
      .onSnapshot((querySnapshot) => {
        setCreatedFolders([]);
        querySnapshot.forEach((doc) => {
          setCreatedFolders((prear) => [...prear, doc]);
        });
      });
  }
  useEffect(() => {
    if (user?.uid) {
      fetchFolders();
    }
  }, [user]);


  const createNote = () => {
    doc_id = Date.now();
    try {
      db.collection("UserData")
        .doc("Users")
        .collection("User")
        .doc(user?.uid)
        .collection("userEditor")
        .doc(String(doc_id))
        .set(
          {
            fileName: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            doc_id: doc_id,
          },
          { merge: true }
        );
    } catch (err) {
      console.log(err);
    }

    setInput("");
  };

  const createPage = () => {
    db.collection("UserData")
      .doc("Users")
      .collection("User")
      .doc(user?.uid)
      .collection("userEditor")
      .add({
        fileName: "Untitled",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        db.collection("UserData")
          .doc("Users")
          .collection("User")
          .doc(user?.uid)
          .collection("userEditor")
          .doc(docRef.id)
          .set(
            {
              doc_id: docRef.id,
            },
            { merge: true }
          );
      });
  };

  const createFolder = () => {
    db.collection("UserData")
      .doc("Users")
      .collection("User")
      .doc(user?.uid)
      .collection("userFolder")
      .add({
        folderName: "Untitled",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        fetchFolders();
      })
  }


  return (
    <div className="navbar">
      <div className="navbar_heading">note.<span>down</span></div>
      <div className="navbar_files_folders_container">
      <div className="navbar_files_container">
        <div className="navbar_files_heading">
          <h3>Files</h3>
          <div className="navbar_files_heading_add">
            <span>
            <HiPlusSm onClick={createPage}/>
            </span>
          </div>
        </div>
        <div className="navbar_files">
          {
            createdFiles.map((file, i) => (
              <div className={file.doc_id === id ?"navbar_files_file_active" : "navbar_files_file_notactive"}>
                  <span><TbFiles/></span>
                  <Link to={`/page/${file.doc_id}`}>{file.fileName}</Link>
              </div>
            ))
          }
        </div>
        <div className="navbar_files_container" style={{width: "100%"}}>
        <div className="navbar_files_heading">
          <h3>Folders</h3>
          <div className="navbar_files_heading_add">
            <span>
            <HiPlusSm onClick={createFolder}/>
            </span>
          </div>
        </div>
        <div className="navbar_folders">
          {
            createdFolders.map((folder, i) => (
              <Folder 
              id = {folder.id}
              folderName = {folder.data().folderName}
              />
            ))
          }
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Navbar;