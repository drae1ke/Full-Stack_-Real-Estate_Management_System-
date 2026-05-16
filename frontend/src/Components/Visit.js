import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { addVisit, getOnePropetyVisitDate } from "../api/visitApi";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Label = styled.label`
  height: 1rem;
  width: 5rem;
`;
const Input = styled.input`
  height: 1.5rem;
  width: 8rem;
`;
const Button = styled.button`
  height: 2rem;
  width: 8rem;
  cursor: pointer;
  font-size: 1.1rem;
  background-color: orange;
  border-radius: 5px;
`;

const Text = styled.div`
  font-weight: 750;
  color: orange;
`;

function Visit({ uid, pid, uname, pname }) {
  const [visitDate, setVisitDate] = useState("");
  const [show, setShow] = useState(false);
  const [isVisitSelect, setIsVisitSelect] = useState();
  const [render, setRender] = useState();
  const [list, setList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const visit = await getOnePropetyVisitDate(pid);
      setList(visit);
      let matchingObject = visit?.find((obj) => obj.userId === uid);
      setIsVisitSelect(matchingObject);
    };
    fetchData();
  }, [pid, uid, render]);

  return (
    <div>
      {show || isVisitSelect ? (
        <VisitFixed isVisitSelect={isVisitSelect} />
      ) : (
        <NotVisitFixed
          visitDate={visitDate}
          setVisitDate={setVisitDate}
          uid={uid}
          pid={pid}
          uname={uname}
          pname={pname}
          setShow={setShow}
          setRender={setRender}
          show={show}
          list={list}
        />
      )}
    </div>
  );
}

function NotVisitFixed({
  visitDate,
  setVisitDate,
  uid,
  pid,
  uname,
  pname,
  setShow,
  show,
  setRender,
  list,
}) {
  const [date, setDate] = useState("");
  
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateString = maxDate.toISOString().split("T")[0];

  useEffect(() => {}, [list]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const visit = {
      userId: uid,
      productId: pid,
      user: uname,
      product: pname,
      isVisited: false,
      date: date,
    };
    setShow((s) => !s);
    setVisitDate(date);
    try {
      await addVisit(visit);
      setRender((r) => !r);
    } catch (error) {
      console.error("Error adding visiting time", error);
    }
  };

  const handleSelect = (e) => {
    const selectedDate = e.target.value;

    if (selectedDate < today || selectedDate > maxDateString) {
      alert("Please select a date within the next 7 days.");
      setDate("");
      return;
    }

    const matchingDate = list?.find((obj) => obj.date === selectedDate);
    if (matchingDate) {
      alert("This date is already booked. Select another date");
    } else {
      setDate(selectedDate);
    }
  };

  
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="visitDate">Visit Date:</Label>
        <p>If your req is rejected then here the calender will show again</p>
        <Input
          id="visitDate"
          name="visitDate"
          type="date"
          value={date}
          min={today} // Restricting past dates
          max={maxDateString} // Restricting to next 7 days
          onChange={handleSelect}
          required
        />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

function VisitFixed({ isVisitSelect }) {
  return (
    <Text>
      {isVisitSelect?.isVisited
        ? `Your request is approved. You can visit on ${isVisitSelect?.date}`
        : `Your request to visit on ${isVisitSelect?.date} has to be approved by admin. Please wait for approval.`}
    </Text>
  );
}

export default Visit;
