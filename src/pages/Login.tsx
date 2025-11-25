import LoginForm from "../components/auth/loginAuth"

export default function Login() {
    return(
        <>
            <main className="flex justify-center items-center h-full">
                <section className="w-full">
                    <LoginForm />
                </section>
            </main>
        </>
    )
}