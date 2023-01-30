from bs4 import BeautifulSoup, SoupStrainer
import threading
import requests

company_info_dict = {}

def keyStatistics(symbol, session):

    yahoo_finance_company_info_page_html = session.get(f"https://finance.yahoo.com/quote/{symbol}?p={symbol}&.tsrc=fin-srch")
    soup_one = BeautifulSoup(yahoo_finance_company_info_page_html.text, 'lxml')

    company_info_title = soup_one.findAll("td", class_="C($primaryColor) W(51%)")
    company_info_value = soup_one.findAll("td", class_="Ta(end) Fw(600) Lh(14px)")

    for info_title, info_value in zip(company_info_title, company_info_value):
        title = info_title.text
        value = info_value.text
        company_info_dict[title] = value

    return company_info_dict



def companyInfo(symbol, session, headers):

    only_p_tags = SoupStrainer("p")
    yahoo_finance_company_profile_page_html = session.get(f"https://finance.yahoo.com/quote/{symbol}/profile?p={symbol}", headers=headers)
    soup_two = BeautifulSoup(yahoo_finance_company_profile_page_html.text, 'lxml', parse_only=only_p_tags)

    headquarters = soup_two.find("p", class_="D(ib) W(47.727%) Pend(40px)").contents[2] if soup_two.find("p", class_="D(ib) W(47.727%) Pend(40px)").contents[2] != "" else "N/A"
    company_description = soup_two.find("p", class_ = "Mt(15px) Lh(1.6)").text if soup_two.find("p", class_ = "Mt(15px) Lh(1.6)").text != "" else "N/A"
    company_sector = soup_two.find("span", class_ = "Fw(600)").contents[0].text if soup_two.find("span", class_ = "Fw(600)").contents[0].text != "" else "N/A"
    company_employees = soup_two.findAll("span", class_ = "Fw(600)")[2].contents[0].text if soup_two.findAll("span", class_ = "Fw(600)")[2].text != "" else "N/A"

    company_info_dict["headquarters"] = headquarters
    company_info_dict["stockDescription"] = company_description
    company_info_dict["sector"] = company_sector
    company_info_dict["employees"] = company_employees

    return company_info_dict
