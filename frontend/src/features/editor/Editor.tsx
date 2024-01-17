import "./editor.css";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { HocuspocusProvider, } from "@hocuspocus/provider";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import * as Y from "yjs";

import MenuBar from "./MenuBar";
import { useAppSelector } from "../../app/hooks";

const colors = ["#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8", "#94FADB", "#B9F18D"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const getInitialUser = (name: string | undefined) => {
  return {
    name: name,
    color: getRandomColor(),
  };
};

const Editor = () => {
  const pageId = useParams().pageId!;

  const [editable, setEditable] = useState(true);
  const [ydoc] = useState(() => new Y.Doc());
  // useMemo maybe?
  const [provider] = useState(
    () => new HocuspocusProvider({
      url: "ws://localhost:3001/collaboration",
      name: pageId.toString(),
      document: ydoc,
      token: "token",
      onAuthenticated: () => setEditable(true),
      onAuthenticationFailed: () => setEditable(false),
      connect: true,
    })
  );

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
        provider: provider,
        user: getInitialUser(useAppSelector(state => state.auth.user?.name)),
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-5 p-2 focus:outline-none border border-grayscale-400 rounded-b-lg min-h-[10rem]",
      },
      editable: () => editable,
    },
  });

  return (
    <div>
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
      <div className="flex justify-between m-5">
        <div className="flex items-center">
          <p className={`${provider.isAuthenticated ? "text-green-200" : "text-red-200"} text-xl mr-1`}>●</p>
          {provider.isAuthenticated
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ? `${editor?.storage.collaborationCursor.users.length} user${editor?.storage.collaborationCursor.users.length === 1 ? "" : "s"} online editing page ${pageId}`
            : "offline"}
        </div>
      </div>
    </div >
  );
};

export default Editor;