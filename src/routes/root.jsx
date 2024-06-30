import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit} from "react-router-dom";
import "./root.css"
import { useEffect, useState } from "react";
import { getContacts, createContact, createGroup, getGroups, deleteGroup, deleteContact } from "../contacts";
import { FaTrash, FaPlusCircle, FaEdit, FaRegCircle   } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

export async function action({request, params}) {
  const formData = await request.formData();
  const formId = formData.get("form-id");
  const groupId = formId.split("-").slice(-1)[0]
  if (formId === "create-group") {
    // const group = await createGroup();
    return redirect("/portal/create_group");
  } else if (formId.includes("edit-group")) {
    return redirect("/portal/" + groupId + "/edit_group");

  }else if (formId.includes("delete-group")) {
    await deleteGroup(groupId);
    const contacts = await getContacts(groupId);
    for (let i = 0; i < contacts.length; i++) {
      await deleteContact(contacts[i].id);
    }
    return redirect("/portal");
  } else if (formId === "log-out") {
    localStorage.setItem("token", false);
    return redirect("/");
  }
  else {
    // const contact = await createContact(formId);
    // return redirect("/portal/contacts/" + contact.id + "/edit");
    return redirect("/portal/"+groupId+"/create_finding")
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
        <div className="search-container">
          <Form id="search-form" role="search">
            <input
              className="search-bar"
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
            <button type="submit" name="form-id" value="create-group" className="group-button add-icon"><FaPlusCircle  size={30} /></button>
          </Form>
        </div>
        <nav className="nav-bar">
          {groups.length ? (
            <ul>
              {groups.map((group) => (
                <li key={group.id}>
                  <div className="group">
                    <div className="group-name-container" onClick={setVisibility(group.id)}>
                      {visible === group.id ? <IoIosArrowDown className="collapse-arrow" size={20}/> : <IoIosArrowForward className="collapse-arrow" size={20}/>}
                      <div className="group-name">
                        {group.name}
                      </div>
                    </div>
                    <Form method="post">
                      <button type="submit" name="form-id" value={"edit-group-"+group.id} className="group-button edit-icon"><FaEdit size={18}/></button>
                    </Form>
                    <Form method="post">
                      <button type="submit" name="form-id" value={group.id} className="group-button add-icon"><FaPlusCircle  size={18}/></button>
                    </Form>
                    <Form method="post">
                      <button type="submit" name="form-id" value={"delete-group-"+group.id} className="group-button trash-icon"><FaTrash size={18}/></button>
                    </Form>
                  </div>
                  {visible === group.id ? (
                    contacts.filter(function(contact){return contact.groupId === group.id}).length ? (
                      <ul>
                        {contacts.filter(function(contact){return contact.groupId === group.id}).map((contact) => (
                          <li key={contact.id} className="findings-container">
                            <NavLink to={`contacts/${contact.id}`}>
                            <FaRegCircle className="collapse-arrow" size={10}/>
                            <div className="findings">
                                {contact.title ? (
                                  <>
                                    {contact.title}
                                  </>
                                ) : (
                                  <>No Data</>
                                )}{" "}
                              </div>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="no-findings">No findings registered</div>
                    )
                  ) : ( null )}
                </li>
              ))}
            </ul>
          ) : (
              <div className="no-findings">No bank registered</div>
          )}
        </nav>
        <Form method="post">
          <button type="submit" className="link-logout-button" name="form-id" value="log-out">Logout</button>
        </Form>
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}