
const BASE_API= 'https://bytegrad.com/course-assets/js/1/api';
const MAX_CHARS=150;
const textareaEl=document.querySelector('.form__textarea');
const counterEl=document.querySelector('.counter');
const formEL=document.querySelector('.form');
const feedbackListEL=document.querySelector('.feedbacks');
const buttonEL=document.querySelector('.submit-btn');
const spinnerEl=document.querySelector('.spinner');
const hashtagEl=document.querySelector('.hashtags');


const renderfeedbackItem=Items=>{
    const feedbackItem=`

    <li class="feedback">
        <button class="upvote">
            <i class="fa-solid fa-caret-up upvote__icon"></i>
            <span class="upvote__count">${Items.upvoteCount}</span>
        </button>
        <section class="feedback__badge">
            <p class="feedback__letter">${Items.badgeLetter}</p>
        </section>
        <div class="feedback__content">
            <p class="feedback__company">${Items.company}</p>
            <p class="feedback__text">${Items.text}</p>
        </div>
        <p class="feedback__date">${Items.daysAgo===0? 'NEW' : `${Items.daysAgo}d`}</p>
    </li>
    `
    
    feedbackListEL.insertAdjacentHTML('beforeend',feedbackItem);
}
//--counter component--//

textareaEl.addEventListener('input',function(){
    const maxChar=MAX_CHARS;
    const typerchar=textareaEl.value.length;
    const charcleft=maxChar-typerchar;
    counterEl.textContent=charcleft;
   

})
//---------------------//

//-- FORM COMPONENT--//


const visualIndicator=(textcheck)=>{
    const className=textcheck==='valid'?'form--valid':'form--invalid';
    formEL.classList.add(className);
    setTimeout(()=> formEL.classList.remove(className),2000);
}

const submitHandler=(event)=>{
  //prevent default action
    event.preventDefault();
    
    const text=textareaEl.value;

    if(text.includes('#') && text.length>=5){
       visualIndicator('valid');
    }
    else{
        visualIndicator('invalid');
        textareaEl.focus();
        return;
    }

    const hashtag = text.split(' ').find(word=>word.includes('#'));
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0,1).toUpperCase();
    const upvoteCount=0;
    const daysAgo=0;

    const feedbackItems={
        upvoteCount: upvoteCount,
        company: company,
        badgeLetter: badgeLetter,
        daysAgo: daysAgo,
        text: text
    };
    
    renderfeedbackItem(feedbackItems);

    fetch(`${BASE_API}/feedbacks`,{
        method: 'POST',
        body: JSON.stringify(feedbackItems),
        headers:{
            Accept:'application/json',
            'content-Type': 'application/json'
        }
    }).then(response=>{
        if(!response.ok){
            console.log('Something went wrong');
            return;
        }
           
        console.log('Successfully submitted');
        
    }).catch(error=>{
        console.log(error);
    });


    //clear text area
    textareaEl.value='';

    // blur submit button
    buttonEL.blur();

    //reset counter
    counterEl.textContent=MAX_CHARS;


}
formEL.addEventListener('submit',submitHandler);


//--list component--//
const clickhandler=(event)=>{
    const clickedEl=event.target;
    const upvoteBtnEL=clickedEl.className.includes('upvote');
    if(upvoteBtnEL)
    {
        const clickedbutton=clickedEl.closest('.upvote');

        clickedbutton.disabled=true;

        const upvotecountEL= clickedbutton.querySelector('.upvote__count');
        let upvoteCount=+upvotecountEL.textContent;
        
        upvotecountEL.textContent=++upvoteCount;
    }
    else{
        //expand feedback item clicked
        clickedEl.closest('.feedback').classList.toggle('feedback--expand');
    }
};

feedbackListEL.addEventListener('click',clickhandler);

fetch(`${BASE_API}/feedbacks`).then(response=>{
    return response.json();
 }).then(data=>{
    //remove spinner
    spinnerEl.remove();


    data.feedbacks.forEach(feedbackItemHTML => {
        renderfeedbackItem(feedbackItemHTML);
    });
    
 }).catch(error=>{ 
    feedbackListEL.textContent=`Falied to fetch feedbacks item. Error message:${error.message}`;
 })



 //--#list component--//

const clickHandler2=event=>{
    const clickedEl=event.target;
    if(clickedEl.className.includes('hashtags')){
        return;
    }
    const namehashtag=clickedEl.textContent.substring(1).toLowerCase().trim();
     feedbackListEL.childNodes.forEach(childNode=>{
        //stop if its a text node
        if(childNode.nodeType===3) return;

        const namefromlist=childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();

        if(namehashtag!==namefromlist){
            childNode.remove();
        }
     });
    
}
hashtagEl.addEventListener('click',clickHandler2);

 