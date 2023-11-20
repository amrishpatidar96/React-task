import React from "react";
import useApiData from "../hooks/useApiData";
import { DataApiUrl } from "../config/url";
import classes from "./UserList.module.css";
import { useNavigate } from "react-router-dom";

function UserList() {
  const { data, loading, error, fetchData } = useApiData(
    DataApiUrl + "/users",
    "get"
  );
  const navigate = useNavigate();

  const userClickHandler = (user) => {
    return () => {
      navigate("/user/" + user.id, {
        state: {
          ...user,
        },
      });
    };
  };

  return (
    <div className={classes.container}>
      <p className={classes.heading}>Directory</p>

      {data &&
        data.length &&
        data.map((user) => {
          const { name, id } = user;
          return (
            <div
              className={classes.user}
              key={id}
              onClick={userClickHandler(user)}
            >
              <div className={classes.username}>
                <p>Name:</p>
                <p>{name}</p>
              </div>
              <p>Posts:12</p>
            </div>
          );
        })}
    </div>
  );
}

export default UserList;
