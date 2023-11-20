import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataApiUrl, worldTimeApiUrl } from "../config/url";
import useApiData from "../hooks/useApiData";
import classes from "./UserDetails.module.css";
function UserDetails() {
  const navigate = useNavigate();
  const [pause, setPause] = useState(false);
  const interval = useRef();
  const [timezone, setTimeZone] = useState();
  const [currentTime, setCurrentTime] = useState("T00:00:00");
  const location = useLocation();
  const user = location.state;
  console.log("user", user);
  const { data, loading, error, fetchData } = useApiData(
    DataApiUrl + "/posts/?userId=" + user?.id,
    "get"
  );
  const countryApiData = useApiData(worldTimeApiUrl, "get");
  const currenTimeApiData = useApiData();
  const fetchCurrentTime = currenTimeApiData?.fetchData;
  const countries = countryApiData?.data;

  useEffect(() => {
    if (currenTimeApiData?.data?.datetime) {
      console.log("1dateWithTimeZone", currenTimeApiData?.data?.datetime);
      setCurrentTime(currenTimeApiData?.data?.datetime);
    }
  }, [currenTimeApiData.data]);

  useEffect(() => {
    if (timezone && currentTime !== "T00:00:00") {
      interval.current = setInterval(() => {
        const milisec = new Date(currentTime)?.getTime();
        const options = { timeZone: timezone };
        const after1sec = milisec + 1000;
        const dateAfter1sec = new Date(after1sec);
        const dateWithTimeZone = dateAfter1sec.toLocaleString(
          undefined,
          options
        );
        let date = dateWithTimeZone?.split(",")[0]?.trim().split("/");
        let time = dateWithTimeZone?.split(",")[1]?.trim();
        setCurrentTime(
          date[2] +
            "-" +
            date[1] +
            "-" +
            date[0] +
            "T" +
            time +
            currentTime.slice(-6)
        );
        console.log(
          "dateWithTimeZone",
          date[2] +
            "-" +
            date[1] +
            "-" +
            date[0] +
            "T" +
            time +
            currentTime.slice(-6)
        );
      }, 1000);
      return () => {
        if (interval.current) clearInterval(interval.current);
      };
    }
  }, [currentTime]);

  useEffect(() => {
    if (countries?.length) {
      fetchCurrentTime(worldTimeApiUrl + "/" + countries[0], "get");
      setTimeZone(countries[0]);
    }
  }, [countries]);

  const clockTime = currentTime?.split("T")[1]?.split(/:|\.|\+/);

  console.log("currentTime", currentTime);
  return (
    <div>
      <div className={classes.headercontainer}>
        <div className={classes.btnback}>
          <button onClick={() => navigate(-1)}>back</button>
        </div>
        <div className={classes.country}>
          <label>
            Country Dropdown:
            <select
              name="selectedFruit"
              onChange={(e) => {
                console.log("selected");
                setTimeZone(e.target.value);
                fetchCurrentTime(worldTimeApiUrl + "/" + e.target.value, "get");
              }}
            >
              {countries &&
                countries?.length &&
                countries?.map((country) => {
                  return <option value={country}>{country}</option>;
                })}
            </select>
          </label>
          <div className={classes.timer}>
            <p>{clockTime[0] + ":"}</p>
            <p>{clockTime[1] + ":"}</p>
            <p>{clockTime[2]}</p>
          </div>
          <button
            onClick={() => {
              if (!pause) {
                clearInterval(interval.current);
              } else {
                if (interval.current) clearInterval(interval.current);
                interval.current = setInterval(() => {
                  const milisec = new Date(currentTime)?.getTime();
                  const options = { timeZone: timezone };
                  const after1sec = milisec + 1000;
                  const dateAfter1sec = new Date(after1sec);
                  const dateWithTimeZone = dateAfter1sec.toLocaleString(
                    undefined,
                    options
                  );
                  let date = dateWithTimeZone?.split(",")[0]?.trim().split("/");
                  let time = dateWithTimeZone?.split(",")[1]?.trim();
                  setCurrentTime(
                    date[2] +
                      "-" +
                      date[1] +
                      "-" +
                      date[0] +
                      "T" +
                      time +
                      currentTime.slice(-6)
                  );
                  console.log(
                    "dateWithTimeZone",
                    date[2] +
                      "-" +
                      date[1] +
                      "-" +
                      date[0] +
                      "T" +
                      time +
                      currentTime.slice(-6)
                  );
                }, 1000);
              }

              setPause((pause) => !pause);
            }}
          >
            {pause ? "start" : "pause"}
          </button>
        </div>
      </div>
      <div className={classes.profilecontainer}>
        <h5>Profile Page</h5>
        <div className={classes.userInfo}>
          <div className={classes.userdata}>
            <div>Name : </div>
            <div>{user?.name}</div>
          </div>

          <div className={classes.userdata}>
            <div>Address : </div>
            <div>
              {user?.address?.suite +
                user?.address?.street +
                user?.address?.city +
                user?.address?.zipcode}
            </div>
          </div>
          <div className={classes.userdata}>
            <div>UserName:</div>
            <div>{user?.username || "username"}</div>
          </div>

          <div className={classes.userdata}>
            <div>Email :</div>
            <div>{user?.email}</div>
          </div>
        </div>
      </div>
      <div className={classes.postContainer}>
        {data &&
          data?.length &&
          data.map((post) => {
            return (
              <div className={classes.post}>
                <h6>{post?.title}</h6>
                <p>{post?.body}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UserDetails;
