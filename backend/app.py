from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)
CORS(app)  # allow React dev server requests

# Mock topics
TOPICS = ["Government Contracts", "Government Grants", "Federal Jobs", "Small Business"]

SAM_GOV_API_KEY = os.getenv('SAM_GOV_API_KEY')
SAM_API_URL = "https://api.sam.gov/opportunities/v2/search"
USE_REAL_SAM_API = False

GRANTS_API_URL = "https://api.grants.gov/v1/api/search2"


MOCK_JOBS = [
    {
        "id": 1,
        "title": "AI/ML Engineer - Defense Applications",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "Department of Defense",
        "location": "Washington, DC",
        "salary": "$120,000 - $160,000",
        "date": "2026-01-25",
        "deadline": "2026-02-28",
        "link": "#"
    },
    {
        "id": 2,
        "title": "Cybersecurity Analyst",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "Department of Homeland Security",
        "location": "Arlington, VA",
        "salary": "$95,000 - $145,000",
        "date": "2026-01-27",
        "deadline": "2026-03-15",
        "link": "#"
    },
    {
        "id": 3,
        "title": "Data Scientist - Intelligence Analysis",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "National Security Agency",
        "location": "Fort Meade, MD",
        "salary": "$110,000 - $170,000",
        "date": "2026-01-26",
        "deadline": "2026-02-20",
        "link": "#"
    },
    {
        "id": 4,
        "title": "Software Engineer - Cloud Infrastructure",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "General Services Administration",
        "location": "Remote",
        "salary": "$105,000 - $155,000",
        "date": "2026-01-24",
        "deadline": "2026-03-01",
        "link": "#"
    },
    {
        "id": 5,
        "title": "Research Scientist - Quantum Computing",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "DARPA",
        "location": "Arlington, VA",
        "salary": "$130,000 - $180,000",
        "date": "2026-01-23",
        "deadline": "2026-02-25",
        "link": "#"
    },
    {
        "id": 6,
        "title": "IT Project Manager - Modernization",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "Veterans Affairs",
        "location": "Multiple Locations",
        "salary": "$100,000 - $150,000",
        "date": "2026-01-28",
        "deadline": "2026-03-10",
        "link": "#"
    },
    {
        "id": 7,
        "title": "DevOps Engineer - Secure Systems",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "Department of Energy",
        "location": "Oak Ridge, TN",
        "salary": "$98,000 - $140,000",
        "date": "2026-01-22",
        "deadline": "2026-02-18",
        "link": "#"
    },
    {
        "id": 8,
        "title": "UX Designer - Public Facing Applications",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "U.S. Digital Service",
        "location": "Washington, DC",
        "salary": "$90,000 - $135,000",
        "date": "2026-01-21",
        "deadline": "2026-03-05",
        "link": "#"
    },
    {
        "id": 9,
        "title": "Space Systems Engineer",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "U.S. Space Force",
        "location": "Colorado Springs, CO",
        "salary": "$115,000 - $165,000",
        "date": "2026-01-27",
        "deadline": "2026-02-27",
        "link": "#"
    },
    {
        "id": 10,
        "title": "Policy Analyst - Technology & Innovation",
        "topic": "Federal Jobs",
        "source": "USAJobs",
        "agency": "Office of Science and Technology Policy",
        "location": "Washington, DC",
        "salary": "$85,000 - $125,000",
        "date": "2026-01-20",
        "deadline": "2026-03-08",
        "link": "#"
    }
]

# Mock SAM.gov contracts (since we hit rate limit)
MOCK_CONTRACTS = [
    {
        'id': 'sam-1',
        'title': 'Cloud Infrastructure Modernization',
        'topic': 'Government Contracts',
        'source': 'SAM.gov',
        'agency': 'Department of Defense',
        'description': 'Seeking proposals for enterprise cloud infrastructure modernization and migration services...',
        'date': '2026-01-27',
        'deadline': '2026-03-15',
        'link': '#',
    },
    {
        'id': 'sam-2',
        'title': 'Cybersecurity Operations Support',
        'topic': 'Government Contracts',
        'source': 'SAM.gov',
        'agency': 'Department of Homeland Security',
        'description': 'Contract opportunity for 24/7 cybersecurity operations center support and threat monitoring...',
        'date': '2026-01-26',
        'deadline': '2026-02-28',
        'link': '#',
    },
    {
        'id': 'sam-3',
        'title': 'AI/ML Development for Intelligence Analysis',
        'topic': 'Government Contracts',
        'source': 'SAM.gov',
        'agency': 'National Geospatial-Intelligence Agency',
        'description': 'Development of machine learning algorithms for automated geospatial intelligence analysis...',
        'date': '2026-01-25',
        'deadline': '2026-03-20',
        'link': '#',
    },
    {
        'id': 'sam-4',
        'title': 'Data Center Consolidation Services',
        'topic': 'Government Contracts',
        'source': 'SAM.gov',
        'agency': 'General Services Administration',
        'description': 'Support for federal data center consolidation initiative including migration and optimization...',
        'date': '2026-01-24',
        'deadline': '2026-03-10',
        'link': '#',
    },
    {
        'id': 'sam-5',
        'title': 'Quantum Computing Research Partnership',
        'topic': 'Government Contracts',
        'source': 'SAM.gov',
        'agency': 'DARPA',
        'description': 'Research and development partnership for quantum computing applications in cryptography...',
        'date': '2026-01-23',
        'deadline': '2026-04-01',
        'link': '#',
    },
    {
        'id': 'sam-6',
        'title': 'Mobile Application Development - Veteran Services',
        'topic': 'Government Contracts',
        'source': 'SAM.gov',
        'agency': 'Department of Veterans Affairs',
        'description': 'Development of mobile applications to improve veteran access to healthcare and benefits...',
        'date': '2026-01-22',
        'deadline': '2026-03-05',
        'link': '#',
    },
    {
        'id': 'sam-7',
        'title': 'Network Infrastructure Upgrade',
        'topic': 'Government Contracts',
        'source': 'SAM.gov',
        'agency': 'Department of Commerce',
        'description': 'Comprehensive network infrastructure upgrade including hardware, software, and security...',
        'date': '2026-01-28',
        'deadline': '2026-02-25',
        'link': '#',
    },
    {
        'id': 'sam-8',
        'title': 'Satellite Communications System',
        'topic': 'Government Contracts',
        'source': 'SAM.gov',
        'agency': 'U.S. Space Force',
        'description': 'Next-generation satellite communications system for secure military operations...',
        'date': '2026-01-21',
        'deadline': '2026-03-30',
        'link': '#',
    }
]

MOCK_SMALL_BUSINESS = [
    {
        'id': 'sb-1',
        'title': 'Small Business Innovation Research (SBIR) - AI for Healthcare',
        'topic': 'Small Business',
        'source': 'SBA.gov',
        'agency': 'Department of Health and Human Services',
        'description': 'SBIR Phase I grant opportunity for small businesses developing AI-powered diagnostic tools...',
        'date': '2026-01-27',
        'deadline': '2026-04-15',
        'link': '#',
        'awardAmount': '$150,000',
    },
    {
        'id': 'sb-2',
        'title': '8(a) Business Development Program Contracts',
        'topic': 'Small Business',
        'source': 'SBA.gov',
        'agency': 'Small Business Administration',
        'description': 'Set-aside contracts for businesses participating in the 8(a) Business Development program...',
        'date': '2026-01-26',
        'deadline': '2026-03-30',
        'link': '#',
    },
    {
        'id': 'sb-3',
        'title': 'Women-Owned Small Business Certification',
        'topic': 'Small Business',
        'source': 'SBA.gov',
        'agency': 'Small Business Administration',
        'description': 'Opportunities for women-owned small businesses in federal contracting...',
        'date': '2026-01-25',
        'deadline': '2026-05-01',
        'link': '#',
    },
    {
        'id': 'sb-4',
        'title': 'SBIR Phase II - Clean Energy Technology',
        'topic': 'Small Business',
        'source': 'Department of Energy',
        'agency': 'Department of Energy',
        'description': 'Phase II funding for small businesses developing innovative clean energy solutions...',
        'date': '2026-01-24',
        'deadline': '2026-03-20',
        'link': '#',
        'awardAmount': '$1,000,000',
    },
    {
        'id': 'sb-5',
        'title': 'HUBZone Certification Opportunities',
        'topic': 'Small Business',
        'source': 'SBA.gov',
        'agency': 'Small Business Administration',
        'description': 'Federal contracting opportunities for small businesses in Historically Underutilized Business Zones...',
        'date': '2026-01-28',
        'deadline': '2026-04-10',
        'link': '#',
    },
    {
        'id': 'sb-6',
        'title': 'Veteran-Owned Small Business Set-Asides',
        'topic': 'Small Business',
        'source': 'VA.gov',
        'agency': 'Department of Veterans Affairs',
        'description': 'Contract opportunities exclusively for service-disabled veteran-owned small businesses...',
        'date': '2026-01-23',
        'deadline': '2026-03-15',
        'link': '#',
    },
    {
        'id': 'sb-7',
        'title': 'STTR Program - Advanced Manufacturing',
        'topic': 'Small Business',
        'source': 'NSF',
        'agency': 'National Science Foundation',
        'description': 'Small Business Technology Transfer grants for university-business partnerships in manufacturing...',
        'date': '2026-01-22',
        'deadline': '2026-04-25',
        'link': '#',
        'awardAmount': '$225,000',
    },
    {
        'id': 'sb-8',
        'title': 'Small Business Cybersecurity Assistance',
        'topic': 'Small Business',
        'source': 'CISA',
        'agency': 'Cybersecurity and Infrastructure Security Agency',
        'description': 'Grant program helping small businesses improve cybersecurity infrastructure and training...',
        'date': '2026-01-21',
        'deadline': '2026-03-28',
        'link': '#',
        'awardAmount': '$50,000',
    },
    {
        'id': 'sb-9',
        'title': 'NASA SBIR - Space Technology',
        'topic': 'Small Business',
        'source': 'NASA',
        'agency': 'National Aeronautics and Space Administration',
        'description': 'SBIR funding for small businesses developing innovative space technologies...',
        'date': '2026-01-20',
        'deadline': '2026-05-05',
        'link': '#',
        'awardAmount': '$175,000',
    },
    {
        'id': 'sb-10',
        'title': 'Economic Injury Disaster Loans',
        'topic': 'Small Business',
        'source': 'SBA.gov',
        'agency': 'Small Business Administration',
        'description': 'Low-interest disaster loans for small businesses affected by economic downturns...',
        'date': '2026-01-19',
        'deadline': 'Ongoing',
        'link': '#',
        'awardAmount': 'Up to $2,000,000',
    }
]

def get_sam_contracts():
    """Return mock SAM.gov contracts (real API hit rate limit during development)"""
    print(f"Using mock SAM.gov data ({len(MOCK_CONTRACTS)} contracts)")
    return MOCK_CONTRACTS

def get_grants():
    """Fetch real grant opportunities from Grants.gov (no auth needed!)"""
    try:
        payload = {
            "keyword": "technology"
        }
        
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(GRANTS_API_URL, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        opportunities = data.get('data', {}).get('oppHits', [])
        
        formatted_grants = []
        for opp in opportunities:
            formatted_grants.append({
                'id': opp.get('id'),
                'title': opp.get('title', 'No title'),
                'topic': 'Government Grants',
                'source': 'Grants.gov',
                'agency': opp.get('agencyName', 'Unknown Agency'),
                'description': opp.get('description', '')[:200] + '...' if opp.get('description') else 'No description',
                'date': opp.get('openDate', ''),
                'deadline': opp.get('closeDate'),
                'link': f"https://grants.gov/search-results-detail/{opp.get('id', '')}" if opp.get('id') else '#',
            })
        
        print(f"Fetched {len(formatted_grants)} grants from Grants.gov")
        return formatted_grants
        
    except Exception as e:
        print(f"Error fetching Grants.gov data: {e}")
        return []

def get_sam_contracts():
    """Fetch SAM.gov contracts (toggleable between mock and real)"""
    
    if not USE_REAL_SAM_API:
        print(f"Using mock SAM.gov data ({len(MOCK_CONTRACTS)} contracts)")
        return MOCK_CONTRACTS
    
    # Real API call (for when you flip the switch tomorrow)
    if not SAM_GOV_API_KEY:
        print("Warning: SAM_GOV_API_KEY not set, returning mock data")
        return MOCK_CONTRACTS
    
    try:
        today = datetime.now()
        thirty_days_ago = today - timedelta(days=30)
        
        params = {
            'api_key': SAM_GOV_API_KEY,
            'postedFrom': thirty_days_ago.strftime('%m/%d/%Y'),
            'postedTo': today.strftime('%m/%d/%Y'),
            'limit': 25,
            'ptype': 'o',
        }
        
        headers = {'Accept': 'application/json'}
        
        response = requests.get(SAM_API_URL, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        opportunities = data.get('opportunitiesData', [])
        
        formatted_contracts = []
        for opp in opportunities:
            formatted_contracts.append({
                'id': opp.get('noticeId'),
                'title': opp.get('title', 'No title'),
                'topic': 'Government Contracts',
                'source': 'SAM.gov',
                'agency': opp.get('department', 'Unknown Agency'),
                'description': opp.get('description', '')[:200] + '...' if opp.get('description') else 'No description',
                'date': opp.get('postedDate', ''),
                'deadline': opp.get('responseDeadLine'),
                'link': f"https://sam.gov/opp/{opp.get('noticeId', '')}" if opp.get('noticeId') else '#',
            })
        
        print(f"Fetched {len(formatted_contracts)} contracts from SAM.gov (live API)")
        return formatted_contracts
        
    except Exception as e:
        print(f"Error fetching SAM.gov data: {e}")
        print("Falling back to mock data")
        return MOCK_CONTRACTS


@app.route("/topics")
def get_topics():
    return jsonify(TOPICS)

@app.route("/topic-counts")
def get_topic_counts():
    """Return count of items per topic"""
    # Combine all feed items
    feed = []
    feed.extend(get_sam_contracts())
    feed.extend(get_grants())
    feed.extend(MOCK_JOBS)
    feed.extend(MOCK_SMALL_BUSINESS)
    
    # Count items per topic
    counts = {}
    for item in feed:
        topic = item.get('topic')
        if topic:
            counts[topic] = counts.get(topic, 0) + 1
    
    return jsonify(counts)

@app.route("/feed")
def get_feed():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    topics_param = request.args.get('topics', '')  
    search_query = request.args.get('search', '').lower() 
    
    # Combine all feed items
    feed = []
    feed.extend(get_sam_contracts())
    feed.extend(get_grants())
    feed.extend(MOCK_JOBS)
    feed.extend(MOCK_SMALL_BUSINESS)
    
    # Filter by topics if provided (comma-separated)
    if topics_param:
        selected_topics = [t.strip() for t in topics_param.split(',')]
        feed = [item for item in feed if item['topic'] in selected_topics]

    if search_query:
        feed = [item for item in feed if search_query in item.get('title', '').lower()]
    
    # Sort by date (newest first)
    feed.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    # Paginate
    start = (page - 1) * per_page
    end = start + per_page
    paginated_feed = feed[start:end]
    
    return jsonify({
        'items': paginated_feed,
        'page': page,
        'has_more': end < len(feed)
    })

if __name__ == "__main__":
    app.run(debug=True)
