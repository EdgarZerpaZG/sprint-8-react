import GoogleMapComponent from "../components/map/map";
// import MapExample from "../components/map/example";

export default function Map(){
    return(
        <>
            <main className="h-full">
                <section className="w-full">
                    <GoogleMapComponent />
                </section>
                <section className="w-full">
                    {/* <MapExample /> */}
                </section>
            </main>
        </>
    )
}