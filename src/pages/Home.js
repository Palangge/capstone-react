export const Home = () => {
    return (
        <>
            <div class="row">
                <div class="col-2">
                        <h2>Your neighborhood's <br /> everyday companion.
                        </h2>
                        <p>Shop all your necessities and favorites from your neighborhood store. <br /> We have a little bit of everything just around the corner.</p>
                        <a href={window.location.origin+"/Products"} class="btn-br">Shop Now &#10170;</a>
                </div>
    
                <div class="col-2">
                    <img src="images/store.png" alt="store" />
                </div>
            </div>
        </>
    );
}