import { Form, useLoaderData } from "react-router-dom";
import { getContact } from "../contacts";
import "./edit_group.css";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  return { contact };
}

export default function Contact() {
  const { contact } = useLoaderData();

  return (
    <div id="contact">
      <div>
        <h1 className="finding-title">{contact.title}</h1>
        {contact.finding && <p className="finding-text">{contact.finding}</p>}
        {contact.measure && <h2>Measures:</h2>}
        {contact.measure && <p className="finding-text">{contact.measure}</p>}
        <div className="edit-button-container">
          <Form action="edit">
            <button type="submit" className="edit-group-button">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="edit-group-button delete-group-button">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

