import { SyntheticEvent, useState } from "react";
import "./newThreadFormStyles.scss";
import { Image } from "react-feather";
import { db } from "../../config/firebase-config";
import { addDoc, collection } from "firebase/firestore";

interface NewThreadFormProps {
  renderThreads: () => {};
}

const NewThreadForm: React.FC<NewThreadFormProps> = ({ renderThreads }) => {
  const [threadBody, setThreadBody] = useState<string>("");

  const threadsCollection = collection(db, "threads");

  const handleThreadSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await addDoc(threadsCollection, {
        body: threadBody,
        created_time: new Date(),
        image:
          "https://firebasestorage.googleapis.com/v0/b/threads-18b4b.appspot.com/o/cf8926676f1da2a45680ed2082a994ba.jpg?alt=media&token=66887208-ed36-442a-87a8-ff94e9aa6b2a",
        owner_id: "D3dUfQaMH3c52nURgKLbtsdV3C53",
      });
      setThreadBody("");
      renderThreads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="new-thread-form-wrapper">
      <form onSubmit={handleThreadSubmit}>
        <textarea
          required
          name="body"
          rows={3}
          placeholder="Start a Thread..."
          value={threadBody}
          onChange={(e) => setThreadBody(e.target.value)}
        ></textarea>

        <div className="new-thread-action-items">
          <Image />
          <button type="submit">Post</button>
        </div>
      </form>
    </div>
  );
};

export default NewThreadForm;
