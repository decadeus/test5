'use client'
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { createClient } from "./../../../utils/supabase/client"; // Assuming this path is correct
import { PlusIcon } from "./../components/icons/PlusIcon";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

const supabase = createClient();

export default function Addnew() {
  const router = useRouter(); // Access the router

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [status, setStatus] = useState("");
  const [allowSelection, setAllowSelection] = useState(true);

  const SelStatus = [
    { label: "active", value: "active" },
    { label: "paused", value: "paused" },
    { label: "vacation", value: "vacation" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await supabase
        .from("test")
        .insert([{ name1, name2, status }]);

      setName1("");
      setName2("");
      setStatus("");
      router.push(router.asPath);
      // Trigger page refresh after successful submission
     
    } catch (error) {
      console.error(error);
      // Handle errors appropriately (display error messages, etc.)
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
                Modal Title
              </ModalHeader>
              <ModalBody>
                <div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                      type="text"
                      value={name1}
                      label="name 1"
                      variant="bordered"
                      onChange={(event) => setName1(event.target.value)}
                    />

                    <Input
                      type="text"
                      value={name2}
                      label="name 2"
                      variant="bordered"
                      onChange={(event) => setName2(event.target.value)}
                    />

                    {allowSelection && (
                      <Select
                        label="Favorite Animal"
                        placeholder="Select an animal"
                        // Removed isDisabled
                        defaultValue="vacation" // Set a default value
                        className="max-w-xs"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {SelStatus.map((animal) => (
                          <SelectItem key={animal.value} value={animal.value}>
                            {animal.label}
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
};
