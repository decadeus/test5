"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { PlusIcon } from "./icons/PlusIcon";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/react";

const supabase = createClient();

export default function Addnew({ user }) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [allowSelection, setAllowSelection] = useState(true);
  const [rules, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const SelStatus = [
    { label: "User", value: "User" },
    { label: "Proprio", value: "Proprio" },
    { label: "Admin", value: "Admin" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const { error } = await supabase
        .from("users")
        .insert({ email, ida: user?.id, rules }); // Pass the text state variable

      if (error) throw error;

      setEmail("");
      setStatus("");
      setEmail("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      console.log(error.message);
      setError("Failed to add text. Please try again.");
    }
  };
  return (
    <>
      <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
        Ajouter
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Email
              </ModalHeader>
              <ModalBody>
                <div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <Input
                      type="email"
                      value={email}
                      label="email"
                      variant="bordered"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    {allowSelection && (
                      <Select
                        label="Status" // Adjusted label
                        placeholder="Select status"
                        defaultValue="User" // Adjusted default value
                        className="max-w-xs"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {SelStatus.map((animal) => (
                          <SelectItem key={animal.value} value={animal.value}>
                            {animal.value}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                    <Button color="primary" type="submit">
                      Ajouter
                    </Button>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
