import React, { useState } from "react";
import { QUERY_USER } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { useQuery, useMutation } from "@apollo/client";

const Profile = () => {
  const [addressText, setText] = useState("");
  const { loading, data } = useQuery(QUERY_USER);

  const [addAddress, { error }] = useMutation(UPDATE_USER, {
    variables: { address: addressText },
  });

  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      //add address to database
      await addAddress({
        variables: { addressText },
      });
      //clear form value
      setText("");
      window.location.replace("/profile");
    } catch (e) {
      console.error(e);
    }
  };

  const user = data?.user || {};

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="profile">
        <h2>Hello {user.username}!</h2>
        <div className="information">
          <div className="info-section">
            Your current username is{" "}
            <span className="highlight">{user.username}</span>
          </div>
          <div className="address-section">
            {!user.address ? (
              <>
                <div>You have not entered an address</div>
                <h1 className="address-title">Please enter your address.</h1>
              </>
            ) : (
              <>
                <div className="info-section">
                  Your current shipping address is: <br />
                  <span className="highlight">{user.address}</span>
                </div>
                <h3 className="address-title">Update your address</h3>
              </>
            )}
            <div className="address-submit">
              {" "}
              <form className="address-submit" onSubmit={handleFormSubmit}>
                <textarea
                  placeholder="Enter Your Address"
                  value={addressText}
                  className="form-input"
                  onChange={handleChange}
                ></textarea>
                <button className="btn col-12 col-md-3" type="submit">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
