// /**
//  * @fileoverview This file is generated by the Angular template compiler.
//  * Do not edit.
//  * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride}
//  */
//  /* tslint:disable */


// import * as import0 from '@angular/core';
// import * as import1 from '@angular/common';
// import * as import2 from './qrscanner.component';
// const styles_QrScannerComponent:any[] = [
//   '[_nghost-%COMP%]   video[_ngcontent-%COMP%] {height: auto; width: 100%;}',
//   '[_nghost-%COMP%]   .mirrored[_ngcontent-%COMP%] { transform: rotateY(180deg); -webkit-transform:rotateY(180deg); -moz-transform:rotateY(180deg); }'
// ]
// ;
// export const RenderType_QrScannerComponent:import0.RendererType2 = import0.ɵcrt({
//   encapsulation: 0,
//   styles: styles_QrScannerComponent,
//   data: {}
// }
// );
// function View_QrScannerComponent_1(l:any):import0.ɵViewDefinition {
//   return import0.ɵvid(0,[
//     (l()(),import0.ɵeld(0,(null as any),(null as any),5,(null as any),(null as any),(null as any),(null as any),(null as any),(null as any),(null as any))),
//     (l()(),import0.ɵted((null as any),['\n                '])),
//     (l()(),import0.ɵeld(0,[
//       [
//         2,
//         0
//       ]
//       ,
//       [
//         'qrCanvas',
//         1
//       ]

//     ]
//       ,(null as any),0,'canvas',[[
//         'hidden',
//         'true'
//       ]
//     ],[
//       [
//         8,
//         'width',
//         0
//       ]
//       ,
//       [
//         8,
//         'height',
//         0
//       ]

//     ]
//     ,(null as any),(null as any),(null as any),(null as any))),
//     (l()(),import0.ɵted((null as any),['\n                '])),
//     (l()(),import0.ɵeld(0,[
//       [
//         1,
//         0
//       ]
//       ,
//       [
//         'videoWrapper',
//         1
//       ]

//     ]
//     ,(null as any),0,'div',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
//     (l()(),import0.ɵted((null as any),['\n            ']))
//   ]
//   ,(null as any),(ck,v) => {
//     var co:any = v.component;
//     const currVal_0:any = co.canvasWidth;
//     const currVal_1:any = co.canvasHeight;
//     ck(v,2,0,currVal_0,currVal_1);
//   });
// }
// function View_QrScannerComponent_2(l:any):import0.ɵViewDefinition {
//   return import0.ɵvid(0,[
//     (l()(),import0.ɵeld(0,(null as any),(null as any),10,(null as any),(null as any),(null as any),(null as any),(null as any),(null as any),(null as any))),
//     (l()(),import0.ɵted((null as any),['\n                '])),
//     (l()(),import0.ɵeld(0,(null as any),(null as any),7,'p',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
//     (l()(),import0.ɵted((null as any),['\n                    You are using an '])),
//     (l()(),import0.ɵeld(0,(null as any),(null as any),1,'strong',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
//     (l()(),import0.ɵted((null as any),['outdated'])),
//     (l()(),import0.ɵted((null as any),[' browser.\n                    Please '])),
//       (l()(),import0.ɵeld(0,(null as any),(null as any),1,'a',[[
//         'href',
//         'http://browsehappy.com/'
//       ]
//     ],(null as any),(null as any),(null as any),(null as any),(null as any))),
//     (l()(),import0.ɵted((null as any),['upgrade your browser'])),
//     (l()(),import0.ɵted((null as any),[' to improve your experience.\n                '])),
//     (l()(),import0.ɵted((null as any),['\n            ']))
//   ]
//   ,(null as any),(null as any));
// }
// export function View_QrScannerComponent_0(l:any):import0.ɵViewDefinition {
//   return import0.ɵvid(0,[
//     import0.ɵqud(671088640,1,{videoWrapper: 0}),
//     import0.ɵqud(671088640,2,{qrCanvas: 0}),
//     (l()(),import0.ɵted((null as any),['\n        '])),
//     (l()(),import0.ɵeld(0,(null as any),(null as any),8,(null as any),(null as any),(null as any),(null as any),(null as any),(null as any),(null as any))),
//       import0.ɵdid(16384,(null as any),0,import1.NgSwitch,([] as any[]),{ngSwitch: [
//         0,
//         'ngSwitch'
//       ]
//     },(null as any)),
//     (l()(),import0.ɵted((null as any),['\n            '])),
//     (l()(),import0.ɵand(16777216,(null as any),(null as any),1,(null as any),View_QrScannerComponent_1)),
//     import0.ɵdid(16384,(null as any),0,import1.NgSwitchDefault,[
//       import0.ViewContainerRef,
//       import0.TemplateRef,
//       import1.NgSwitch
//     ]
//     ,(null as any),(null as any)),
//     (l()(),import0.ɵted((null as any),['\n            '])),
//     (l()(),import0.ɵand(16777216,(null as any),(null as any),1,(null as any),View_QrScannerComponent_2)),
//     import0.ɵdid(278528,(null as any),0,import1.NgSwitchCase,[
//       import0.ViewContainerRef,
//       import0.TemplateRef,
//       import1.NgSwitch
//     ]
//       ,{ngSwitchCase: [
//         0,
//         'ngSwitchCase'
//       ]
//     },(null as any)),
//     (l()(),import0.ɵted((null as any),['\n        ']))
//   ]
//   ,(ck,v) => {
//     var co:import2.QrScannerComponent = v.component;
//     const currVal_0:any = co.supported;
//     ck(v,4,0,currVal_0);
//     const currVal_1:any = false;
//     ck(v,10,0,currVal_1);
//   },(null as any));
// }
// function View_QrScannerComponent_Host_0(l:any):import0.ɵViewDefinition {
//   return import0.ɵvid(0,[
//     (l()(),import0.ɵeld(0,(null as any),(null as any),1,'qr-scanner',([] as any[]),(null as any),(null as any),(null as any),View_QrScannerComponent_0,RenderType_QrScannerComponent)),
//     import0.ɵdid(4440064,(null as any),0,import2.QrScannerComponent,[
//       import0.Renderer2,
//       import0.ElementRef
//     ]
//     ,(null as any),(null as any))
//   ]
//   ,(ck,v) => {
//     ck(v,1,0);
//   },(null as any));
// }
// export const QrScannerComponentNgFactory:import0.ComponentFactory<import2.QrScannerComponent> = import0.ɵccf('qr-scanner',import2.QrScannerComponent,View_QrScannerComponent_Host_0,{
//   canvasWidth: 'canvasWidth',
//   canvasHeight: 'canvasHeight',
//   facing: 'facing',
//   debug: 'debug',
//   mirror: 'mirror',
//   stopAfterScan: 'stopAfterScan',
//   updateTime: 'updateTime'
// }
// ,{onRead: 'onRead'},([] as any[]));
// //# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiQzovVXNlcnMvSm/Do28gR29uw6dhbHZlcy93b3JrL2FuZ3VsYXIyLXFyc2Nhbm5lci9zcmMvcXJzY2FubmVyLmNvbXBvbmVudC5uZ2ZhY3RvcnkudHMiLCJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzovLy9DOi9Vc2Vycy9Kb8OjbyBHb27Dp2FsdmVzL3dvcmsvYW5ndWxhcjItcXJzY2FubmVyL3NyYy9xcnNjYW5uZXIuY29tcG9uZW50LnRzIiwibmc6Ly8vQzovVXNlcnMvSm/Do28gR29uw6dhbHZlcy93b3JrL2FuZ3VsYXIyLXFyc2Nhbm5lci9zcmMvcXJzY2FubmVyLmNvbXBvbmVudC50cy5RclNjYW5uZXJDb21wb25lbnQuaHRtbCIsIm5nOi8vL0M6L1VzZXJzL0pvw6NvIEdvbsOnYWx2ZXMvd29yay9hbmd1bGFyMi1xcnNjYW5uZXIvc3JjL3Fyc2Nhbm5lci5jb21wb25lbnQudHMuUXJTY2FubmVyQ29tcG9uZW50X0hvc3QuaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyIgIiwiXG4gICAgICAgIDxuZy1jb250YWluZXIgW25nU3dpdGNoXT1cInN1cHBvcnRlZFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hEZWZhdWx0PlxuICAgICAgICAgICAgICAgIDxjYW52YXMgI3FyQ2FudmFzIFt3aWR0aF09XCJjYW52YXNXaWR0aFwiIFtoZWlnaHRdPVwiY2FudmFzSGVpZ2h0XCIgaGlkZGVuPVwidHJ1ZVwiPjwvY2FudmFzPlxuICAgICAgICAgICAgICAgIDxkaXYgI3ZpZGVvV3JhcHBlcj48L2Rpdj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiZmFsc2VcIj5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgICAgWW91IGFyZSB1c2luZyBhbiA8c3Ryb25nPm91dGRhdGVkPC9zdHJvbmc+IGJyb3dzZXIuXG4gICAgICAgICAgICAgICAgICAgIFBsZWFzZSA8YSBocmVmPVwiaHR0cDovL2Jyb3dzZWhhcHB5LmNvbS9cIj51cGdyYWRlIHlvdXIgYnJvd3NlcjwvYT4gdG8gaW1wcm92ZSB5b3VyIGV4cGVyaWVuY2UuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPiIsIjxxci1zY2FubmVyPjwvcXItc2Nhbm5lcj4iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNFWTtJQUErQjtJQUMzQjtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO09BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO0lBQXVGO0lBQ3ZGO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtJQUF5Qjs7OztJQURQO0lBQXNCO0lBQXhDLFNBQWtCLFVBQXNCLFNBQXhDOzs7OztJQUdKO0lBQW9DO0lBQ2hDO0lBQUc7SUFDa0I7SUFBUTtJQUFpQjtNQUNuQztRQUFBO1FBQUE7TUFBQTtJQUFBO0lBQWtDO0lBQXdCO0lBQ2pFOzs7Ozs7OztJQVZwQjtJQUNRO2tCQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7SUFBcUM7SUFDakM7Z0JBQUE7Ozs7SUFBQTtLQUFBO0lBR2U7SUFDZjtnQkFBQTs7OztJQUFBO09BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUtlOzs7O0lBVkw7SUFBZCxTQUFjLFNBQWQ7SUFLa0I7SUFBZCxVQUFjLFNBQWQ7Ozs7O0lDTlo7Z0JBQUE7OztJQUFBO0tBQUE7OztJQUFBOzs7Ozs7Ozs7Ozs7In0=
