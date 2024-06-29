import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateGroup } from "../contacts";
import "./edit_group.css";

export async function action({ request, params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateGroup(params.groupId, updates);
    return redirect("/portal");
}

export default function EditGroup() {
    const { group } = useLoaderData();
    const navigate = useNavigate();


    return (
        <Form method="post" id="group-form">
            <input  placeholder="Bank name"
                    aria-label="Bank name"
                    type="text"
                    name="name"
                    className="edit-group-input"
                    defaultValue={group?.bank_name}
            />
            <button type="submit" className="edit-group-button">Save</button>
            <button type="button" className="edit-group-button" onClick={() => {
                navigate(-1);
            }}>Cancel</button>
        </Form>
    );
}