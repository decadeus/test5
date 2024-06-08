"use client";
import { useState, useEffect } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { createClient } from "../../utils/supabase/client";


const supabase = createClient();

export default function Basic() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: rows, error } = await supabase.from("test").select("*");
      if (error) {
        console.log(error);
      } else {
        setRows(rows);
      }
    }
    fetchData();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name1", label: "NAME1" },
    { key: "name2", label: "NAME2" },
  ];

  return (
    <div>
        <h2 className="font-bold text-xl pl-10 underline">basic</h2>
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
}
