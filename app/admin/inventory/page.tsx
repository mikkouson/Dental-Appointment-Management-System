"use client";

import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const Inventory = () => {
  const { data, error } = useSWR(`/api/inventory`, fetcher);
  if (error) return <div>Error loading timeslots.</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <>
      {data.map((item) => (
        <div>
          <p>{item.id}</p>
          <p>{item.name}</p>
          <p>{item.description}</p>
          <p>{item.quantity}</p>
        </div>
      ))}
    </>
  );
};

export default Inventory;
