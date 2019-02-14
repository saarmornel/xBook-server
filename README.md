# exBook - 1.0

## CI Information
### Build Status
[![Build Status](https://travis-ci.org/)]()

## Getting Started
### Installation
        npm install

### Testing
        npm test

### Running the server
        npm start

### Running with live reload (using nodemon)
        npm run dev

## API Endpoints
### 1. User
| Method 	| Endpoint          	            | Description                    	| Required Permissions  	| Example           	|
|--------	|--------------------------------	|--------------------------------	|-----------------------	|-------------------	|
| GET    	| /api/user/login         | Return information about logging-in             	|  	| /api/user/login         	|
| POST    	| /api/user/login         | Log in with local user             	|  	| /api/user/login         	|
| GET    	| /api/user/signup         | Returns information about signing-up             	|  	| /api/user/signup         	|
| POST    	| /api/user/signup         | Sing up with local user             	|  	| /api/user/signup         	|
| GET    	| /api/user/profile 	            | Returns the current user's profile      	| Login required        	| /api/user/profile 	|
| GET    	| /api/user/:id                 	| Return specific user's profile if exists 	|  	| /api/user/5487754 	|
| GET    	| /api/user/logout                	| Logout the current user 	| Login required 	| /api/user/logout 	|
| GET    	| /api/user/auth/facebook                	| Login via Facebook 	|  	| /api/user/auth/facebook 	|
| POST    	| /api/user/friend/:id                	| Send friend request 	|  Login required	| /api/user/friend/5487754  	|
| PUT    	| /api/user/friend/:id                	| Accept friend request 	| Login required 	| /api/user/friend/5487754  	|
| DELETE    	| /api/user/friend/:id                	| Reject/Remove friend request 	| Login required 	| /api/user/friend/5487754  	|
| GET    	| /api/user/friend/pending               	| Return user's pending friends 	|  Login required	| /api/user/friend/pending  	|
| GET    	| /api/user/friend/requested               	| Return user's requested friends 	|  Login required	| /api/user/friend/requested  	|

### 2. Item
| Method 	| Endpoint          	            | Description                    	| Required Permissions  	| Example           	|
|--------	|--------------------------------	|--------------------------------	|-----------------------	|-------------------	|
| GET    	| /api/item/        	            | Return all items (allow search and pagination)          	| Login required 	| /api/item/145263   |
| GET    	| /api/item/:id         	            | Return item by id              	| 	| /api/item/145263   |
| GET    	| /api/item/personal         	            | Return all current user's items              	| Login required 	| /api/item/personal   |
| POST    	| /api/item/         	            | Create new item             	| Login required 	| /api/item/   |
| PUT    	| /api/item/:id         	            | Update item by id              	| Login required	| /api/item/145263   |
| DELETE    	| /api/item/:id         	            | Delete item by id              	| Login required	| /api/item/145263   |
| POST    	| /api/item/buy/:id      	            | Buy item by id              	| Login required	| /api/item/145263   |

