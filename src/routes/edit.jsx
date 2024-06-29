import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";
import "./edit_group.css";

export async function action({ request, params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    return redirect("/portal/contacts/" + params.contactId);
}

export default function EditContact() {
    const { contact } = useLoaderData();
    const navigate = useNavigate();


    return (
        <Form method="post" id="contact-form">
            <input
                placeholder="Finding title"
                aria-label="Finding title"
                type="text"
                name="title"
                className="edit-group-input"
                defaultValue={contact?.title}
            />
            <input
                placeholder="Finding text"
                aria-label="Finding text"
                type="text"
                name="finding"
                className="edit-group-input"
                defaultValue={contact?.finding}
            />
            <input
                placeholder="Measure"
                aria-label="Measure"
                type="text"
                name="measure"
                className="edit-group-input"
                defaultValue={contact?.measure}
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