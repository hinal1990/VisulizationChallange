import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component'; 
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  let component:AppComponent;
  let fixture: ComponentFixture<AppComponent>
  beforeEach(async(() => {
    //component = new AppComponent();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(()=>{
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have re-render chart', () => {
    
    spyOn(component, 'renderChart').and.callThrough();;
    component.selectChangeHandler('All');
    expect(component.renderChart).toHaveBeenCalled();
    
  });

 
});
