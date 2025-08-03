import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { AuthService } from '../../../../auth/data/auth.service';

@Component({
  selector: 'app-room',
  imports: [],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {

  roomId: string = '';
  currentUser: string = '';
  zp: any;

  @ViewChild('videoContainer', { static: true }) videoContainer!: ElementRef;

  constructor(private route: ActivatedRoute, private authSer: AuthService) { }

  ngOnInit(): void {

    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    this.currentUser = this.authSer.getCurrentUser()?.email || '';

  }

  ngAfterViewInit() {

    const appID = 1921228070;
    const serverSecret = 'd675c88cd4f50a1d78b07ea01bc57446';

    const userID = String(Math.floor(Math.random() * 10000));
    const userName = this.currentUser;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      this.roomId,
      userID,
      userName
    );

    this.zp = ZegoUIKitPrebuilt.create(kitToken);

    this.zp.joinRoom({
      container: this.videoContainer.nativeElement,
      sharedLinks: [
        {
          name: 'Copy Link',
          url: window.location.origin + '/user/room/' + this.roomId,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
    });

  }

  ngOnDestroy() {
    if (this.zp) {
      this.zp.destroy();
    }
  }

}


