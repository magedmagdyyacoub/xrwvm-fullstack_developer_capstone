import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Dealers.css';
import '../assets/style.css';
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [carmodels, setCarmodels] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const id = params.id;

  const rootUrl = window.location.href.split('postreview')[0];
  const dealerUrl = `${rootUrl}djangoapp/dealer/${id}`;
  const reviewUrl = `${rootUrl}djangoapp/add_review`;
  const carModelsUrl = `${rootUrl}djangoapp/get_cars`;

  const fetchDealer = async () => {
    try {
      const res = await fetch(dealerUrl);
      const data = await res.json();
      if (data.status === 200 && data.dealer.length > 0) {
        setDealer(data.dealer[0]);
      }
    } catch (error) {
      console.error('Failed to fetch dealer:', error);
    }
  };

  const fetchCarModels = async () => {
    try {
      const res = await fetch(carModelsUrl);
      const data = await res.json();
      if (data.CarModels) {
        setCarmodels(data.CarModels);
      }
    } catch (error) {
      console.error('Failed to fetch car models:', error);
    }
  };

  const handlePostReview = async () => {
    const name = sessionStorage.getItem('firstname') + ' ' + sessionStorage.getItem('lastname') || sessionStorage.getItem('username');

    if (!model || !review || !date || !year) {
      setError('All fields are mandatory.');
      return;
    }

    const [makeChosen, modelChosen] = model.split(' ');
    const payload = {
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: makeChosen,
      car_model: modelChosen,
      car_year: year,
    };

    try {
      const res = await fetch(reviewUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === 200) {
        window.location.href = `${window.location.origin}/dealer/${id}`;
      } else {
        setError('Failed to post review.');
      }
    } catch (error) {
      console.error('Error posting review:', error);
      setError('An error occurred while submitting your review.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchDealer(), fetchCarModels()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div>
      <Header />
      <div className="review-container" style={{ margin: '5%' }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h1 style={{ color: 'darkblue' }}>{dealer.full_name}</h1>
            {error && <p className="error">{error}</p>}
            <textarea
              id="review"
              cols="50"
              rows="7"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <div className="input-field">
              <label>Purchase Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Car Make & Model</label>
              <select
                name="cars"
                id="cars"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="" disabled hidden>
                  Choose Car Make and Model
                </option>
                {carmodels.map((carmodel) => (
                  <option
                    key={`${carmodel.CarMake}-${carmodel.CarModel}`}
                    value={`${carmodel.CarMake} ${carmodel.CarModel}`}
                  >
                    {carmodel.CarMake} {carmodel.CarModel}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field">
              <label>Car Year</label>
              <input
                type="number"
                max={2023}
                min={2015}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div>
              <button
                className="postreview"
                onClick={handlePostReview}
                disabled={!review || !model || !date || !year}
              >
                Post Review
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostReview;
