import React, { useEffect, useState } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { db, firebase, auth } from "../../firebase";
import { useParams } from "react-router-dom";
const RawOutput = () => {
    const [user, loading] = useAuthState(auth);
    const [htmlCode, setHtmlCode] = useState('');
    const { id } = useParams();
    const src = `
        <html>
            <body>${htmlCode}</body>
        </html>
    `
    useEffect(() => {
        if (user) {
            db.collection("UserData")
                .doc("Users")
                .collection("User")
                .doc(user?.uid)
                .collection("userEditor")
                .doc(id)
                .get()
                .then((doc) => {
                    for (let block of doc?.data()?.notes?.blocks) {
                        if (block.type === "raw") {
                            setHtmlCode(block.data.html)
                        }
                    }
                });
            }
        }, []);
    return (
         <div style={{ height: "43vh" }}>
            <iframe
              srcDoc={src}
              title='output'
              sandbox='allow-scripts'
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </div>
    )
}

export default RawOutput