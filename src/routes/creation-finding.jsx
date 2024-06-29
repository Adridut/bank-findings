import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact, createContact } from "../contacts";
import "./edit_group.css";

export async function action({ request, params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    updates.groupId = params.groupId;
    const contact = await createContact()
    await updateContact(contact.id, updates);
    return redirect("/portal/contacts/" + contact.id);
}

export default function CreateFinding() {
    const navigate = useNavigate();

    return (
        <Form method="post" id="contact-form" className="edit-group-container">
            <input
                placeholder="Finding title"
                aria-label="Finding title"
                type="text"
                name="title"
                className="edit-group-title-input"
                required={true}
            />
            <textarea
                placeholder="Finding text"
                aria-label="Finding text"
                type="text"
                name="finding"
                className="edit-group-input"
            />
            <textarea
                placeholder="Measure"
                aria-label="Measure"
                type="text"
                name="measure"
                className="edit-group-input"
            />
            <div>
                <button type="submit" className="edit-group-button">Save</button>
                <button type="button" className="edit-group-button" onClick={() => {
                    navigate(-1);
                }}>Cancel</button>
            </div>
        </Form>
    );
}