import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit} from "react-router-dom";
import "./root.css"
import { useEffect, useState } from "react";
import { getContacts, createContact, createGroup, getGroups, deleteGroup, deleteContact } from "../contacts";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";





export async function action({request, params}) {
  const formData = await request.formData();
  const formId = formData.get("form-id");
  if (formId === "create-group") {
    const group = await createGroup();
    return redirect("/portal/" + group.id + "/edit_group");
  } else if (formId.includes("delete-group")) {
    const groupId = formId.split("-").slice(-1)[0]
    await deleteGroup(groupId);
    const contacts = await getContacts(groupId);
    for (let i = 0; i < contacts.length; i++) {
      await deleteContact(contacts[i].id);
    }
    return redirect("/portal");
  }
  else {
    const contact = await createContact(formId);
    return redirect("/portal/contacts/" + contact.id + "/edit");
  }
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  const groups = await getGroups()
  return { contacts, q, groups };
}

export default function Root() {
  const { contacts, q, groups } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();


  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  const [visible, setVisible] = useState(0)

  const setVisibility = (id) =>{
    if (id === visible){
      return () => setVisible(0)
    } else {
      return () => setVisible(id)
    }
  }


  return (
    <>
      <div id="sidebar">
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
          </Form>
          <Form method="post">
            <button type="submit" name="form-id" value="create-group">New</button>
          </Form>
        </div>
        <nav className="nav-bar">
          {groups.length ? (
            <ul>
              {groups.map((group) => (
                <li key={group.id}>
                  <div className="group" onClick={setVisibility(group.id)}>
                    {visible === group.id ? <IoIosArrowDown className="collapse-arrow" size={20}/> : <IoIosArrowForward className="collapse-arrow" size={20}/>}
                    <div className="group-name">
                      {group.name}
                    </div>
                    <Form method="post">
                      <button type="submit" name="form-id" value={group.id} className="group-button"><FaPlusCircle  size={20}/></button>
                    </Form>
                    <Form method="post">
                      <button type="submit" name="form-id" value={"delete-group-"+group.id} className="group-button"><FaTrash size={20}/></button>
                    </Form>
                  </div>
                  {visible === group.id ? (
                    contacts.filter(function(contact){return contact.groupId === group.id}).length ? (
                      <ul>
                        {contacts.filter(function(contact){return contact.groupId === group.id}).map((contact) => (
                          <li key={contact.id}>
                            <NavLink to={`contacts/${contact.id}`}>
                              {contact.first || contact.last ? (
                                <>
                                  {contact.first} {contact.last} {contact.id} {contact.groupId}
                                </>
                              ) : (
                                <i>No Data</i>
                              )}{" "}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        <i>No findings</i>
                      </p>
                    )
                  ) : ( null )}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No banks registered</i>
            </p>
          )}
        </nav>
        <Link className="link-logout-button" to="/">Logout</Link>
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}