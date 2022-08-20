import { useEffect, useState } from "react";
import { useInit, useQuery, tx, transact, id, auth } from "@instantdb/react";

function Login() {
    const [state, setState] = useState({
      sentEmail: "",
      email: "",
      code: "",
    });
    const { sentEmail, email, code } = state;
    return (
      <div>
        <div>
          {!sentEmail ? (
            <div key="em">
              <h2>Let's log you in!</h2>
              <div>
                <input
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setState({ ...state, email: e.target.value })}
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    setState({ ...state, sentEmail: email });
                    auth.sendMagicCode({ email }).catch((err) => {
                      alert("Uh oh :" + err.body?.message);
                      setState({ ...state, sentEmail: "" });
                    });
                  }}
                >
                  Send Code
                </button>
              </div>
            </div>
          ) : (
            <div key="cd">
              <h2>Okay we sent you an email! What was the code?</h2>
              <div>
                <input
                  type="text"
                  placeholder="Code plz"
                  value={code || ""}
                  onChange={(e) => setState({ ...state, code: e.target.value })}
                />
              </div>
              <button
                onClick={(e) => {
                  auth
                    .verifyMagicCode({ email: sentEmail, code })
                    .catch((err) => {
                      alert("Uh oh :" + err.body?.message);
                      setState({ ...state, code: "" });
                    });
                }}
              >
                Verify
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

export default Login;