export const About = () => {
    return (
        <>
            <div class="card">
                <div class="card-header text-center">
                    <h1>About Us</h1>
                </div>
                <div class="card-body">
                    <ul class="about-intro">
                        <li>
                            We are a family-owned business that has been serving our local community for 21 years already. We offers a wide range of essential items, from groceries to household supplies, all at affordable prices. We take pride in our commitment to providing high-quality products and excellent customer service.
                        </li>
                        <li>
                            Our journey began with a simple vision - to create a place where everyone can shop for their daily needs conveniently. Over time, we have grown to become one of the most trusted sari-sari stores in our area. Our success is a testament to our dedication and hard work in serving our customers' needs.
                        </li>
                        <li>
                            At our store, we believe in fostering strong relationships with our customers. We treat everyone who visits our store like family, and we are always willing to go the extra mile to ensure their satisfaction. 
                        </li>

                    </ul>
                </div>
            </div>

            <div class="accordion accordion-flush" id="accordionFlushExample">

                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            <p>VISION</p>
                        </button>
                    </h2>
                    <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">
                            <ul>
                                <li>
                                    &#8226; To become the leading sari-sari store in our community by consistently delivering exceptional value and service to our customers.
                                </li>
                                <li>
                                    &#8226; We strive to be a trusted partner in their daily lives, offering a diverse range of products that cater to their evolving needs while maintaining our commitment to affordability and quality
                                </li>
                                <li>
                                    &#8226; to establish a long-term relationship with our customers, built on trust, respect, and mutual benefit.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingTwo">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            <p>MISSION</p>
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">
                            <ul>
                                <li>
                                    &#8226; To provide a convenient and reliable shopping experience to our customers by offering a wide variety of quality products at affordable prices.
                                </li>
                                <li>
                                    &#8226; To create a welcoming environment where customers can find all their essential needs under one roof and receive excellent customer service.
                                </li> 
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingThree">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                            <p>LOCATION</p>
                        </button>
                    </h2>
                    <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                        <ul>
                            <li>
                                &#8226; Addres: Proper, Bagasawe, Tuburan, Cebu, 6043
                            </li>
                            <li>
                                &#8226; We are located near Bagasawe Elementary School.
                            </li>
                        </ul>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d898.5769464139331!2d123.83954476244047!3d10.763676925082342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1679721579112!5m2!1sen!2sph" width="100%" height="450" style={{border:10}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    </div>
                </div>
            
            </div>
        </>
    );
}