import "./editor.css";

import { HocuspocusProvider } from "@hocuspocus/provider";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  useCallback, useEffect,
  useState,
} from "react";
import * as Y from "yjs";

import MenuBar from "./MenuBar";
import { useAppSelector } from "../../app/hooks";

const colors = ["#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8", "#94FADB", "#B9F18D"];

const getRandomElement = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const getRandomColor = () => getRandomElement(colors);

const room = 10;

const ydoc = new Y.Doc();
let editable = false;
const websocketProvider = new HocuspocusProvider({
  url: "ws://localhost:3001/collaboration",
  name: "10",
  document: ydoc,
  token: "token",
  onAuthenticated: () => { editable = true; }
});

const getInitialUser = (name: string | undefined) => {
  return {
    name: name,
    color: getRandomColor(),
  };
};

const Editor = () => {
  const [status, setStatus] = useState("connecting");
  const [currentUser, setCurrentUser] = useState(getInitialUser(useAppSelector(state => state.auth.user)?.name));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: websocketProvider,
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-5 p-2 focus:outline-none border border-grayscale-400 rounded-b-lg min-h-[10rem]",
      },
      editable: () => editable,
    },
    autofocus: false,
  });

  useEffect(() => {
    // Update status changes
    websocketProvider.on("status", (event: { status: string; }) => {
      setStatus(event.status);
    });
  }, []);

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      editor.chain().focus().updateUser(currentUser).run();
    }
  }, [editor, currentUser]);

  const setName = useCallback(() => {
    const name = (window.prompt("Name") ?? "").trim().substring(0, 32);

    if (name) {
      return setCurrentUser({ ...currentUser, name });
    }
  }, [currentUser]);

  return (
    <div>
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
      <div className="flex justify-between m-5">
        <div className="flex items-center">
          <p className={`${status === "connected" ? "text-green-200" : "text-red-200"} text-xl mr-1`}>●</p>
          {status === "connected"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ? `${editor?.storage.collaborationCursor.users.length} user${editor?.storage.collaborationCursor.users.length === 1 ? "" : "s"} online in ${room}`
            : "offline"}
        </div>
        <div>
          <button onClick={setName} className="btn-text-xs">{currentUser.name}</button>
        </div>
      </div>
    </div >
  );
};

export { Editor };
