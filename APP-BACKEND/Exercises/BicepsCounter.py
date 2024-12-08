import cv2
from cvzone.PoseModule import PoseDetector
import numpy as np

cap = cv2.VideoCapture(0)
detector = PoseDetector(detectionCon=0.69)

color = (0, 0, 255)
rep_count = 0
direction = 0  # 0 for down, 1 for up (detecting curl direction)

while True:
    _, img = cap.read()
    img = detector.findPose(img)
    lmlst, bbox = detector.findPosition(img, draw=False)

    if lmlst:
        try:
            # Using the right side landmarks: right shoulder (12), right elbow (14), right wrist (16)
            angle = detector.findAngle(img, 12, 14, 16)  # Right side arm angle (shoulder-elbow-wrist)

            # Interpolate the angle to a range for the bar position
            bar_val = np.interp(angle, (40, 155), (300, 60))  # Map angle range to vertical position

            # Draw the angle on the image
            cv2.putText(img, f'Angle: {int(angle)}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

            # Draw the filled rectangle representing the bar
            cv2.rectangle(img, (560, int(bar_val)), (40 + 560, 300 + 60), color, cv2.FILLED)
            cv2.rectangle(img, (590, 60), (40 + 560, 300 + 60), (0, 0, 0), 9)

            # Detect Rep count by checking angle changes (up and down motion)
            if angle < 70 and direction == 0:  # Curl is complete (elbow is close to 70° or less)
                direction = 1  # Now moving up
                rep_count += 1
                print(f'Rep count: {rep_count}')

            elif angle > 155 and direction == 1:  # Elbow is fully extended (returning down)
                direction = 0  # Now moving down

            # Perfect form indicator
            if 40 <= angle <= 155:
                form_text = "Perfect Form"
                form_color = (0, 255, 0)  # Green for perfect form
            else:
                form_text = "Incorrect Form"
                form_color = (0, 0, 255)  # Red for incorrect form

            cv2.putText(img, form_text, (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, form_color, 2, cv2.LINE_AA)

        except Exception as e:
            print(f"Error calculating angle: {e}")

    # Display the rep count on the image
    cv2.putText(img, f'Reps: {rep_count}', (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)

    cv2.imshow('Biceps Curl Counter', img)

    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
