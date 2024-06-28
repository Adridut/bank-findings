import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit} from "react-router-dom";
import "./root.css"
import { useEffect } from "react";
import { getContacts, createContact, createGroup, getGroups } from "../contacts";

// export async function action() {
//   const contact = await createContact();
//   return redirect("/portal/contacts/" + contact.id + "/edit");
// }

export async function action({request, params}) {
  const formData = await request.formData();
  const formId = formData.get("form-id");
  if (formId === "create-group") {
    const group = await createGroup();
    return redirect("/portal/" + group.id + "/edit_group");
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
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
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
                  <div>
                    {group.name} {group.id}
                  </div>
                  <Form method="post">
                    <button type="submit" name="form-id" value={group.id}>New</button>
                  </Form>
                  {contacts.filter(function(contact){return contact.groupId === group.id}).length ? (
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
                  )}
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