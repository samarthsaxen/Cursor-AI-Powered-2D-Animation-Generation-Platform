# backend/src/templates/template_scene.py
from manim import *
import json

# THIS LINE WILL BE REPLACED BY NODE: {"left":"https://in.images.search.yahoo.com/search/images;_ylt=Awrx_ag10yRpKAIAAdO7HAx.;_ylu=Y29sbwNzZzMEcG9zAzEEdnRpZAMEc2VjA3Ny?type=G210IN1589G91963Ma54eb1aabb67b88cecd5280c733a344a&p=apple+image+png&fr=mcafee&imgurl=https%3A%2F%2Fwww.bing.com%2Fimages%2Fsearch%3Fview%3DdetailV2%26ccid%3DNwlFmAVY%26id%3DF448D3E1DEE84D350FFBA952F21EBB5374CF43B0%26thid%3DOIP.NwlFmAVYQxzAvMYb5qyb2QHaHz%26mediaurl%3Dhttps%3A%2F%2Fimg.freepik.com%2Ffree-psd%2Fclose-up-delicious-apple_23-2151868338.jpg%26exph%3D626%26expw%3D594%26q%3Dapple%2520image%2520png%26ck%3DC39C1624FB1A374DF1C97A6F51AD04D6%26idpp%3Drc%26idpview%3Dsingleimage%26form%3Drc2idp&name=apple+image+png2&turl=https%3A%2F%2Fsp.yimg.com%2Fib%2Fth%2Fid%2FOIP.NwlFmAVYQxzAvMYb5qyb2QHaHz%3Fpid%3DApi%26w%3D148%26h%3D148%26c%3D7%26dpr%3D2%26rs%3D1&tt=apple+image+png2&sigit=duMtyGDVECdK&sigi=i6xWlmCWpzQL&sign=rKGQWWj7mdAV&sigt=rKGQWWj7mdAV","mid":"https://in.images.search.yahoo.com/search/images;_ylt=AwrKCWRj0yRpHAIArzq7HAx.;_ylu=Y29sbwNzZzMEcG9zAzEEdnRpZAMEc2VjA3Nj?type=G210IN1589G91963Ma54eb1aabb67b88cecd5280c733a344a&p=banana+images&fr=mcafee&th=366&tw=474&imgurl=https%3A%2F%2Fjooinn.com%2Fimages%2Fbanana-7.jpg&rurl=https%3A%2F%2Fjooinn.com%2Fbanana-7.html&size=1686KB&name=Free+photo%3A+Banana+-+Appetizing%2C+Macro%2C+White+-+Free+Download+-+Jooinn&oid=2&h=2295&w=2970&turl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.O8lKDwWSZP_Cfm8eeyw3wAHaFu%3Fpid%3DApi&tt=Free+photo%3A+Banana+-+Appetizing%2C+Macro%2C+White+-+Free+Download+-+Jooinn&sigr=okqq5BPTXNeO&sigit=ZnvEhlct6nzg&sigi=RVBzDqY5dpq3&sign=fh9gWQvh9kml&sigt=fh9gWQvh9kml","topRight":"Arti","bottomRight":"1234"}
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
