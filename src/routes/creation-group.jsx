import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateGroup, createGroup } from "../contacts";
import "./edit_group.css";

export async function action({ request, params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const group = await createGroup()
    await updateGroup(group.id, updates);
    return redirect("/portal");
}

export default function CreateGroup() {
    const navigate = useNavigate();


    return (
        <Form method="post" id="group-form">
            <input  placeholder="Bank name"
                    aria-label="Bank name"
                    type="text"
                    name="name"
                    className="edit-group-input"
            />
            <button type="submit" className="edit-group-button">Save</button>
            <button type="button" className="edit-group-button" onClick={() => {
                navigate(-1);
            }}>Cancel</button>
        </Form>
    );
}