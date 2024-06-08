"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Textarea,
  Button,
  Avatar,
} from "@nextui-org/react";
import { useState } from "react";
import { FaInfo } from "react-icons/fa";
import { createClient } from "./../../../utils/supabase/client";
export default function Info({ user }) {
  const supabase = createClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [text, setText] = useState("");
  const [alert, setAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = { id: user?.id, text, alert };
      await supabase.from("profiles").upsert(data);
      console.log("Data successfully sent to the database:", data);
      setText("");
      setAlert(false);
    } catch (error) {
      console.error("Error occurred during database operation:", error);
    }
  };
  const handleOpen = () => {
    setText(user.text);
    setAlert(user.alert);
    onOpen();
  };
  return (
    <>
      <Button
        isIconOnly
        color={user.info ? "danger" : "default"}
        size="sm"
        onPress={handleOpen}
        radius="full"
        variant="light"
      >
        <div className={user.alert ? "bg-red-500 rounded-full text-white p-1" : ""}>
      {/* Utilisation de la classe conditionnelle pour déterminer la couleur */}
      <FaInfo  />
    </div>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="bg-white">
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 p-0 m-0"></ModalHeader>
              <ModalBody className="p-0 m-0">
                <div className="">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-center w-full p-0 m-0 "
                  >
                    <div className="flex flex-col items-center justify-center  bg-gray-700">
                      <div className="pt-20">
                        <Avatar
                          size="lg"
                          src={user.avatar_url}
                          alt="Avatar"
                          className="w-28 h-28 text-large outline-8 outline-white -m-8"
                        />
                      </div>
                    </div>
                    <div className="p-4 pt-20 flex flex-col justify-center items-center">
                      <p className="">{user.email}</p>
                      <p className=""> {user.pseudo}</p>
                      <Textarea
                        value={text}
                        variant="bordered"
                        defaultValue={user.text}
                        onChange={(event) => setText(event.target.value)}
                        className="pt-8"
                      />
                      <div className="flex flex-row justify-center items-center gap-8">
                        <Checkbox
                          value={alert}
                          defaultSelected={user.alert}
                          onChange={(event) => setAlert(event.target.checked)}
                          color="danger"
                          className="flex pt-8 pb-8"
                        >
                          <p className="text-red-300 font-bold">Important</p>
                        </Checkbox>
                        <Button
                          color="primary"
                          type="submit"
                          onPress={onClose}
                          variant="shadow"
                          className="justify-end flex "
                        >
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
