import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactUsPage = () => {
    return (
        <div>
            {/* Team Role Section */}
            <section className="py-5">
                <div className="container text-center">
                    <h2 className="mb-5">Our Team</h2>
                    <div className="row">
                        {/* Role 1 */}
                        <div className="col-md-3">
                            <div className="mb-3">
                                <img
                                    src="/ajay.jpeg" // Replace with your image
                                    alt="Ajay"
                                    className="rounded-circle img-fluid"
                                    style={{ width: '150px', height: '150px' }}
                                />
                            </div>
                            <h5>Developer</h5>
                            <p>An enthusiastic developer ensuring successful project delivery and coordination.</p>
                        </div>

                        {/* Role 2 */}
                        <div className="col-md-3">
                            <div className="mb-3">
                                <img
                                    src="/vinotha.jpeg" // Replace with your image
                                    alt="Vinotha"
                                    className="rounded-circle img-fluid"
                                    style={{ width: '150px', height: '150px' }}
                                />
                            </div>
                            <h5>Developer</h5>
                            <p>An enthusiastic developer focusing on building and designing user-friendly interfaces.</p>
                        </div>

                        {/* Role 3 */}
                        <div className="col-md-3">
                            <div className="mb-3">
                                <img
                                    src="/pavani.jpeg" // Replace with your image
                                    alt="Pavani"
                                    className="rounded-circle img-fluid"
                                    style={{ width: '150px', height: '150px' }}
                                />
                            </div>
                            <h5>Developer</h5>
                            <p>An enthusiastic developer handling server-side logic and maintaining the database.</p>
                        </div>

                        {/* Role 4 */}
                        <div className="col-md-3">
                            <div className="mb-3">
                                <img
                                    src="/teja.jpeg" // Replace with your image
                                    alt="Teja"
                                    className="rounded-circle img-fluid"
                                    style={{ width: '150px', height: '150px' }}
                                />
                            </div>
                            <h5>Developer</h5>
                            <p>An enthusiastic developer dedicated to  user friendly frontend and ensuring a seamless user experience.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="mb-4">Explore Different Cuisines</h2>
                    <div className="row">
                        {/* Cuisine 1 */}
                        <div className="col-md-4">
                            <img
                                src="/c2.jpg" // Replace with your image
                                alt="Italian Cuisine"
                                className="img-fluid mb-3"
                                style={{ borderRadius: '10px' }}
                            />
                            <h5>Italian Cuisine</h5>
                            <p>Experience the authentic taste of Italy with pasta, pizza, and more.</p>
                        </div>

                        {/* Cuisine 2 */}
                        <div className="col-md-4">
                            <img
                                src="/c1.webp" // Replace with your image
                                alt="Indian Cuisine"
                                className="img-fluid mb-3"
                                style={{ borderRadius: '10px' }}
                            />
                            <h5>Indian Cuisine</h5>
                            <p>Indulge in vibrant spices and traditional dishes from India.</p>
                        </div>

                        {/* Cuisine 3 */}
                        <div className="col-md-4">
                            <img
                                src="/c3.webp" // Replace with your image
                                alt="Japanese Cuisine"
                                className="img-fluid mb-3"
                                style={{ borderRadius: '10px' }}
                            />
                            <h5>Japanese Cuisine</h5>
                            <p>Savor the delicate flavors of sushi, ramen, and more.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUsPage;
