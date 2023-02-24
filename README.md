<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url] -->
<!-- [![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/iamharis08/Robinhood-Clone/wiki">
    <!-- <img src="images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

<h1 align="center">Risinghood</h1>

  <p align="center">
    Risinghood -- a Robinhood inspired website
    <br />
    Project Link: (https://risinghood.onrender.com/)
    <br />
    <a href="https://github.com/iamharis08/Robinhood-Clone/wiki"><strong>Checkout the Docs »</strong></a>
    <br />
    <br />
    <a href="https://risinghood.onrender.com">View Demo Site</a>
    ·
    <a href="https://github.com/iamharis08/Robinhood-Clone/issues">Report Bug</a>
    ·
    <!-- <a href="https://github.com/iamharis08/Robinhood-Clone/issues">Request Feature</a> -->
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#preview-images">Preview Images</a></li>
    <!-- <li><a href="#contributing">Contributing</a></li> -->
    <!-- <li><a href="#license">License</a></li> -->
    <li><a href="#contact">Contact</a></li>
    <!-- <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>

<!-- PREVIEW IMAGES -->
## Preview Images
![image](https://user-images.githubusercontent.com/76670635/221090017-221e9635-55ec-4d5c-b60b-cb34478c764b.png)

![image](https://user-images.githubusercontent.com/76670635/221087515-fd084207-c1d8-41db-b135-7b1705c1cfd9.png)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

Risinghood is a Robinhood clone that lets users simulate the experience of investing their money in the stock market. The user is able to buy and sell any stocks listed in the NASDAQ and the New York Stock Exchange. The site also shows company financial data and historical data charts. The site utilizes web scraping with beautifulSoup and multithreading in python to acquire data for each stock.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Optimization -->
## Optimizations
Used BeautifulSoup as a web scraper library

***TO INCREASE*** the speed of the web scraper, first, we used a different parser. We used **`lxml`** parser which has a more optimized performance than a html.parser which is pythons default parser. **`lxml`** uses a C-based parser which is generally faster than a python-based parser html.parser. The C-based parser is able to handle a larger number of elements in a document and can better handle malformed HTML.

***REQUEST SPEED INCREASED*** by using sessions because if you are consistently making the same requests to the same url then by using sessions, the TCP connection is remembered.

******Increased speed of web scraper by incorporating multithreading****** 

**Without Multithreading -** web scraper average timing scraping info for stocks page company info was on **average** **2.901 seconds** from testing **10 full scraped data returns** with the highest being **8.19 seconds** and the lowest being **1.4 seconds**

**With Multithreading -** web scraper average timing scraping info for stocks page company info was on **average** **1.433 seconds** from testing **10 full scraped data returns** with the highest being **3.8 seconds** and the lowest being **1.03 seconds**

<!-- Issues -->
## Problems Solved
**ISSUE #1**  yahoo finance was blocking the requests depending on the user agent meaning it only allowed requests from a browser. Therefore I was not able to make requests using python.

**FIX #1 :** I changed the User-Agent by including it in the headers in the requests and specified Mozilla, Chrome, and Safari.
<!-- * []()
* []()
* []() -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* React: https://reactjs.org/
* Redux: https://redux.js.org/
* Flask: https://flask.palletsprojects.com/en/2.2.x/
* Flask-SQLAlchemy: https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/
* Node.js: https://nodejs.org/en/
* Python: https://www.python.org/



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Below is how you can get the project started in a local environment

### Prerequisites

You will need to define a .env file to setup a database filepath / SECRET_KEY
* Ex: .env

```
SECRET_KEY=your_key_here
DATABASE_URL=sqlite:///dev.db
```

### Installation

1. Clone the repo

2. Refer to README in './app' for backend Python / Flask setup

3. Refer to README in './react-app' for frontend JSX / React setup

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

The Risinghood project is a free investing simulation website that is inspired by Robinhood, with core site feature functionality in line with the target site's MVP's:
 * Watchlist functionality to keep track of favorite stock prices
 * Make stock transactions
 * Veiw details and charts of every company stock in the NASDAQ and NYSE
 * User portfolio with profit and loss chart
 * View market and company News


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
<!-- ## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->



<!-- CONTACT -->
## Contact
Haris Ahmed - iamharis08@gmail.com - [LinkedIn](https://www.linkedin.com/in/harisahmed12/) - [Portfolio Site](https://iamharis08.github.io/)

Project Link: [https://github.com/iamharis08/Robinhood-Clone](https://github.com/iamharis08/Robinhood-Clone)

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/jacoblauxman/aa-capstone.svg?style=for-the-badge
[contributors-url]: https://github.com/jacoblauxman/aa-capstone/graphs/contributors

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[ExpressJS-url]: https://expressjs.com/
[Sequelize-url]: https://sequelize.org/
