# 6. User Stories and Acceptance Criteria

| Requirement ID | User Story                                                                      | Acceptance Criteria                                                                                  |
| -------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| ST-101         | As a user, I want to input a prompt and receive generated images.               | Upon submitting a prompt, the application displays the generated images in the timeline.             |
| ST-102         | As a user, I want to view my prompt history.                                    | The application maintains and displays a history of submitted prompts.                               |
| ST-103         | As a user, I want to filter generated images by date, status, and aspect ratio. | The filtering options correctly display images based on the selected criteria.                       |
| ST-104         | As a user, I want to sort images by newest or oldest first.                     | The timeline rearranges images according to the selected sort order.                                 |
| ST-105         | As a user, I want to download images by clicking on them.                       | Clicking an image initiates a download of the image in webp format.                                  |
| ST-106         | As a user, I want to view detailed information about a prompt.                  | The prompt details view displays all associated images and metadata.                                 |
| ST-107         | As a user, I want to re-run a previous prompt.                                  | Selecting a past prompt and choosing to re-run it generates new images based on the same parameters. |
| ST-108         | As a user, I want my generated images to be stored locally.                     | Generated images are saved in the browser's local storage and persist across sessions.               |
| ST-109         | As a user, I want to securely store my OpenAI API key.                          | The API key is saved in local storage and used for subsequent API calls.                             |
| ST-110         | As a user, I want to clear my local storage data.                               | The settings menu provides an option to clear all stored data, including images and API key.         |
| ST-111         | As a user, I want the application to be responsive across devices.              | The application adjusts its layout appropriately for mobile, tablet, and desktop devices.            |
| ST-112         | As a user, I want to submit prompts with customizable parameters.               | The prompt input allows setting parameters like quality, aspect ratio, and number of images.         |
| ST-113         | As a user, I want to view images in their correct aspect ratio.                 | Images are displayed within square containers, maintaining their original aspect ratios.             |
| ST-114         | As a user, I want to manage my prompt submissions efficiently.                  | The application handles multiple prompt submissions and displays them appropriately in the timeline. |
| ST-115         | As a user, I want to access a settings menu for configurations.                 | The navigation bar includes a settings button that opens the settings menu.                          | 