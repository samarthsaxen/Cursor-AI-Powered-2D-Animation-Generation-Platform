# backend/src/templates/template_scene.py
from manim import *
import json

# THIS LINE WILL BE REPLACED BY NODE: {{LABEL_JSON}}
LABELS = json.loads('{{LABEL_JSON}}')

class GeneratedScene(Scene):
    def construct(self):
        left = Rectangle(width=3, height=1.3).set_fill(BLUE, opacity=1).set_stroke(WHITE, 3).to_edge(LEFT).shift(UP*0.5)
        left_text = Text(LABELS.get('left','Client'), font_size=24).move_to(left.get_center())

        mid = Rectangle(width=3, height=1.3).set_fill(GREEN, opacity=1).set_stroke(WHITE, 3).shift(RIGHT*0.2)
        mid_text = Text(LABELS.get('mid','Server'), font_size=24).move_to(mid.get_center())

        topRight = Rectangle(width=3, height=1.3).set_fill(ORANGE, opacity=1).set_stroke(WHITE, 3).to_edge(RIGHT).shift(UP*1)
        top_text = Text(LABELS.get('topRight','Cache'), font_size=24).move_to(topRight.get_center())

        bottomRight = Rectangle(width=3, height=1.3).set_fill(RED, opacity=1).set_stroke(WHITE, 3).to_edge(RIGHT).shift(DOWN*1)
        bottom_text = Text(LABELS.get('bottomRight','Database'), font_size=24).move_to(bottomRight.get_center())

        self.add(left, left_text, mid, mid_text, topRight, top_text, bottomRight, bottom_text)

        arr1 = Arrow(left.get_right(), mid.get_left())
        arr2 = Arrow(mid.get_right(), topRight.get_left())
        arr3 = Arrow(mid.get_right(), bottomRight.get_left())
        self.play(Create(arr1), Create(arr2), Create(arr3))
        self.wait(2)
