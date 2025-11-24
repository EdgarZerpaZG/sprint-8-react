import GoogleMapComponent from "../components/map/map"

export default function Map(){
    return(
        <>
            <main className="flex justify-center items-center h-full">
                <section className="w-full">
                    <GoogleMapComponent />
                </section>
            </main>
        </>
    )
}