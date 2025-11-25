import RegisterForm from "../components/auth/registerAuth"

export default function Register() {
    return(
        <>
            <main className="flex justify-center items-center h-full">
                <section className="w-full">
                    <RegisterForm />
                </section>
            </main>
        </>
    )
}