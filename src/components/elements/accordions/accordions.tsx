import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import './accordions.scss'
import AccordionDetail from './accordionDetail';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';

export default function CustomizedAccordions() {

    interface IDayElement {
      mealName: string,
      grams: number,
      kcal: number,
      prot: number,
      fats: number,
      carbs: number,
      image?: string
    }
    
    interface IDay {
      elements?: IDayElement[]
    }

    interface IDays {
      id: number,
      name: string,
      empty: boolean,
      extension: IDay
    }



    const lunch:IDay ={
      elements: [
        {
          mealName: "Kebab",
          grams: 200,
          kcal: 510,
          prot: 28.4,
          fats: 32.4,
          carbs: 28.0,
          image:'https://staticsmaker.iplsc.com/smaker_production_2022_11_16/26bb30c30d60775239c5bc09c9735973-recipe_main.jpg'
        },
        {
          mealName: "Frytki",
          grams: 500,
          kcal: 220,
          prot: 0,
          fats: 0,
          carbs: 55.0
        }
      ]
    }

    const days:IDays[] = [
      {
        id: 1,
        name: 'Breakfast',
        empty: true,
        extension: [] as IDay
      },
      {
        id: 2,
        name: 'Snack I',
        empty: true,
        extension: [] as IDay
      },
      {
        id: 3,
        name: 'Lunch',
        empty: false,
        extension:lunch
      },
      {
        id: 4,
        name: 'Snack II',
        empty: true,
        extension: [] as IDay
      },
      {
        id: 5,
        name: 'Dinner',
        empty: true,
        extension: [] as IDay
      },
      {
        id: 6,
        name: 'Snack III',
        empty: true,
        extension: [] as IDay
      },
    ]

  interface IValues {
      kcal: number,
      prot: number,
      fats: number,
      carbs: number
    }

const summaryNutritionalValues = (elements: IDayElement[] | undefined) => {
  let  kcal = 0, prot = 0, fats = 0, carbs = 0;
  
  elements && elements.forEach((element: IDayElement) => {
    kcal += element.kcal;
    prot += element.prot;
    fats += element.fats;
    carbs += element.carbs;
  })

  return {
    "kcal":kcal,
    "prot":prot,
    "fats":fats,
    "carbs":carbs
  }
}

const [width, setWidth] = React.useState<number>(window.innerWidth);

function handleWindowSizeChange() {
    setWidth(window.innerWidth);
}
React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
}, []);


  const details = (extension: IDay | undefined) => {
    if(!extension) return <div></div>
    const value: IValues = summaryNutritionalValues(extension.elements)
    return <p className='summary'>
      {
        width >= 450 ? `${value.kcal} kcal | P ${value.prot}g F ${value.fats}g C ${value.carbs}g`
        : width >= 310 ? `${value.kcal} kcal | C ${value.carbs}g` : width >= 250 ?  `${value.kcal} kcal` : ''
      }
    </p>
  }
  

  interface IElement {
    header: string,
    secondary: string,
    image: string,
  }

  const elements =  (elements: IDayElement[] | undefined): IElement[] | undefined => {
    if(!elements) return undefined

    return elements.map((el: IDayElement)  => {
      return {
      header: `${el.mealName} | ${el.kcal} kcal`,
      secondary: `Prot. ${el.prot} Fats ${el.fats}g Crabs ${el.carbs}g`,
      image: el.image ? el.image : ''
    }})

  }

  const [expanded, setExpanded] = React.useState<string | false>(false);

  return (
    <div>
      {
      days.map((element: IDays) => (
        
      <Accordion expanded={expanded === `panel${element.id}`} key={element.id} sx={{marginBottom: "5px", borderRadius: "10px"}}>
        <AccordionSummary
         sx={{flexDirection: !element.empty ? "row" : ""}}
         expandIcon={element.empty ? <IconButton aria-label="AddIcon" size="small"><AddIcon /> </IconButton> : ''
          // <IconButton aria-label="handleChange" size="small" onClick={()=> setExpanded(!expanded ? `panel${element.id}` : false) }> <ExpandMoreIcon /> </IconButton>
        }
         
        aria-controls={element.name + "-content"}
        id={element.name}
        >
          <Typography>{element.name} </Typography>
          {
           !element.empty ?
            <Grid container justifyContent="space-between">
              <Grid sx={{display: "flex", justifyContent:'center'}}>
                <Typography component={'span'} sx={{ color: 'text.secondary' }}>{details(element.extension)}</Typography>
                <IconButton className={"MyIconButton"} sx={{rotate: expanded  ? '180deg' : '', marginLeft: '2px'}} aria-label="handleChange" size="small" onClick={()=> setExpanded(!expanded ? `panel${element.id}` : false) }> <ExpandMoreIcon /></IconButton>
              </Grid>
              <Grid sx={{display: "flex", justifyContent:'center', marginLeft: '2px', marginRight: '3px'}}>
                <IconButton className={"MyIconButton"} aria-label="FunctionsOutlinedIcon" size="small"><FunctionsOutlinedIcon /></IconButton>
                <IconButton className={"MyIconButton"} aria-label="AddIcon " size="small"><AddIcon  /></IconButton>
              </Grid>
            </Grid>
            : ''
           
          }
        </AccordionSummary>
        <AccordionDetails>
          <AccordionDetail elementsProps={elements(element.extension?.elements)} />
        </AccordionDetails>
      </Accordion>

      ))}
    </div>
  );
}