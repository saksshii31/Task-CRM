import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPassword({ params }) {
  const resolvedParams = await params;
  const token = resolvedParams?.token;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Invalid or missing token</p>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
