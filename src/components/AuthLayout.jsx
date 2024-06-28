import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";

export const AuthLayout = () => {
  const outlet = useOutlet();

  const { userPromise } = useLoaderData();

  return (
    <Suspense>
      <Await
        resolve={userPromise}
        errorElement={<div severity="error">Something went wrong!</div>}
        children={(user) => (
          <AuthProvider userData={user}>{outlet}</AuthProvider>
        )}
      />
    </Suspense>
  );
};